import test from "node:test";
import assert from "node:assert/strict";

// Mock localStorage for Node test runner
const storage = new Map();
globalThis.window = {
  dispatchEvent: () => {},
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.localStorage = {
  getItem: (key) => (storage.has(key) ? storage.get(key) : null),
  setItem: (key, val) => storage.set(key, String(val)),
  removeItem: (key) => storage.delete(key),
  clear: () => storage.clear(),
};
globalThis.CustomEvent = class CustomEvent {
  constructor(name) {
    this.name = name;
  }
};

const {
  getMembers,
  getMemberById,
  saveMember,
  updateMemberLevel,
  updateMemberStatus,
  toggleDirectoryVisibility,
  deleteMember,
  resetMembers,
  getApplications,
  submitApplication,
  approveApplication,
  rejectApplication,
  deleteApplication,
  MEMBER_LEVELS,
} = await import("../src/lib/member-service.ts");

test("member-service: initial getMembers returns default seed roster with levels", () => {
  storage.clear();
  const list = getMembers();
  assert.ok(Array.isArray(list));
  assert.ok(list.length >= 5);

  const m1 = list.find((m) => m.id === "m1");
  assert.ok(m1);
  assert.equal(m1.name, "Dara Sok");
  assert.equal(m1.level, "Professional");
  assert.equal(m1.status, "Active");
});

test("member-service: saveMember adds a new member with level, affiliation, and field", () => {
  const created = saveMember({
    name: "Dr. Chantha Meas",
    nameKm: "បណ្ឌិត មាស ចន្ថា",
    email: "chantha@itc.edu.kh",
    level: "Honorary Fellow",
    status: "Active",
    affiliation: "Institute of Technology of Cambodia",
    affiliationKm: "វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា",
    field: "Petrology & Geochemistry",
    fieldKm: "សិលាវិទ្យា និងគីមីភូគព្ភសាស្ត្រ",
    showInDirectory: true,
  });

  assert.ok(created.id);
  assert.equal(created.name, "Dr. Chantha Meas");
  assert.equal(created.level, "Honorary Fellow");

  const fetched = getMemberById(created.id);
  assert.ok(fetched);
  assert.equal(fetched.email, "chantha@itc.edu.kh");
});

test("member-service: updateMemberLevel updates the member tier level", () => {
  const created = saveMember({
    name: "Student Candidate",
    email: "student@test.org",
    level: "Student",
  });

  assert.equal(created.level, "Student");

  // Promote to Professional using updateMemberLevel
  const updated = updateMemberLevel(created.id, "Professional");
  assert.ok(updated);
  assert.equal(updated.level, "Professional");

  // Promote to Executive
  const exec = updateMemberLevel(created.id, "Executive");
  assert.ok(exec);
  assert.equal(exec.level, "Executive");

  const verified = getMemberById(created.id);
  assert.equal(verified?.level, "Executive");
});

test("member-service: deleteMember removes the member from the registry", () => {
  const created = saveMember({
    name: "Member To Delete",
    email: "todelete@test.org",
  });

  assert.ok(getMemberById(created.id));

  const deleted = deleteMember(created.id);
  assert.equal(deleted, true);
  assert.equal(getMemberById(created.id), undefined);
});

test("member-service: toggleDirectoryVisibility toggles public directory listing", () => {
  const created = saveMember({
    name: "Visibility Test",
    email: "visibility@test.org",
    showInDirectory: true,
  });

  assert.equal(created.showInDirectory, true);

  const toggledOff = toggleDirectoryVisibility(created.id);
  assert.equal(toggledOff?.showInDirectory, false);

  const toggledOn = toggleDirectoryVisibility(created.id);
  assert.equal(toggledOn?.showInDirectory, true);
});

test("member-service: applications approval automatically enrolls applicant into members list", () => {
  const app = submitApplication({
    name: "Sreyneang Prak",
    email: "sreyneang@example.com",
    category: "Student",
    affiliation: "RUPP Department of Earth Sciences",
    field: "Environmental Geosciences",
    showInDirectory: true,
  });

  assert.ok(app.id);
  assert.equal(app.status, "pending");

  const result = approveApplication(app.id, "Student");
  assert.ok(result);
  assert.equal(result.application.status, "approved");
  assert.equal(result.member.name, "Sreyneang Prak");
  assert.equal(result.member.level, "Student");
  assert.equal(result.member.affiliation, "RUPP Department of Earth Sciences");

  // Verify enrolled member is in getMembers()
  const found = getMemberById(result.member.id);
  assert.ok(found);
  assert.equal(found.name, "Sreyneang Prak");
});
