import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const postManagerSrc = fs.readFileSync(
  path.resolve("src/admin/PostManager.tsx"),
  "utf8"
);
const wpAdminSrc = fs.readFileSync(
  path.resolve("src/admin/WordPressAdmin.tsx"),
  "utf8"
);
const wpAdminCss = fs.readFileSync(
  path.resolve("src/admin/wp-admin.css"),
  "utf8"
);

test("Classic Editor: renders authentic WordPress Classic Editor matching screenshot", () => {
  // Title Input & Permalink
  assert.ok(
    postManagerSrc.includes('id="post-title"'),
    "Must include authentic WordPress post title input"
  );
  assert.ok(
    postManagerSrc.includes('placeholder="Enter title here"'),
    "Must have 'Enter title here' placeholder matching classic WordPress"
  );
  assert.ok(
    postManagerSrc.includes("Permalink:"),
    "Must display classic WordPress permalink line"
  );
  assert.ok(
    postManagerSrc.includes("isEditingSlug"),
    "Must allow inline editing of permalink slug"
  );

  // Add Media & Visual/Text Tabs
  assert.ok(
    postManagerSrc.includes("Add Media"),
    "Must include Add Media button above editor toolbar"
  );
  assert.ok(
    postManagerSrc.includes('handleSwitchEditorMode("visual")'),
    "Must include Visual tab switch"
  );
  assert.ok(
    postManagerSrc.includes('handleSwitchEditorMode("text")'),
    "Must include Text tab switch"
  );

  // TinyMCE Classic Toolbar
  assert.ok(
    postManagerSrc.includes("renderClassicToolbar"),
    "Must render the authentic WordPress Classic TinyMCE toolbar"
  );
  assert.ok(
    postManagerSrc.includes('<option value="p">Paragraph</option>'),
    "Must include Paragraph format dropdown"
  );
  assert.ok(
    postManagerSrc.includes('<option value="h1">Heading 1</option>'),
    "Must include Heading options in format dropdown"
  );
  assert.ok(
    postManagerSrc.includes('title="Bold (Ctrl+B)"'),
    "Must include Bold button in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Italic (Ctrl+I)"'),
    "Must include Italic button in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Bulleted list"'),
    "Must include Bulleted list in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Numbered list"'),
    "Must include Numbered list in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Blockquote"'),
    "Must include Blockquote in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Align Left"'),
    "Must include Align Left in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Align Center"'),
    "Must include Align Center in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Align Right"'),
    "Must include Align Right in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Insert/edit link (Ctrl+K)"'),
    "Must include Link button in toolbar"
  );
  assert.ok(
    postManagerSrc.includes('title="Toolbar Toggle (Kitchen Sink)"'),
    "Must include Kitchen Sink toggle in toolbar"
  );

  // Kitchen Sink Row 2
  assert.ok(
    postManagerSrc.includes('title="Strikethrough"'),
    "Must include Strikethrough in kitchen sink"
  );
  assert.ok(
    postManagerSrc.includes('title="Horizontal line"'),
    "Must include Horizontal line in kitchen sink"
  );
  assert.ok(
    postManagerSrc.includes('title="Text color"'),
    "Must include Text color in kitchen sink"
  );
  assert.ok(
    postManagerSrc.includes('title="Clear formatting"'),
    "Must include Clear formatting in kitchen sink"
  );
  assert.ok(
    postManagerSrc.includes('title="Special character"'),
    "Must include Special character in kitchen sink"
  );

  // Status Bar
  assert.ok(
    postManagerSrc.includes("Word count:"),
    "Must display live word count in editor footer bar"
  );
  assert.ok(
    postManagerSrc.includes("Draft saved at"),
    "Must display draft saved timestamp in footer bar"
  );
});

test("Classic Editor: Right sidebar meta boxes (Publish, Format, Categories, Featured Image)", () => {
  // Publish Box
  assert.ok(
    postManagerSrc.includes("renderPublishBox"),
    "Must render Publish meta box"
  );
  assert.ok(
    postManagerSrc.includes("Save Draft"),
    "Must have Save Draft button in Publish box"
  );
  assert.ok(
    postManagerSrc.includes("Preview"),
    "Must have Preview button in Publish box"
  );
  assert.ok(
    postManagerSrc.includes("Move to Trash"),
    "Must have Move to Trash link in Publish box"
  );

  // Format Box
  assert.ok(
    postManagerSrc.includes("renderFormatBox"),
    "Must render Format meta box"
  );
  assert.ok(
    postManagerSrc.includes('name="post-format"'),
    "Must include post format radio choices"
  );

  // Categories Box
  assert.ok(
    postManagerSrc.includes("renderCategoriesBox"),
    "Must render Categories meta box"
  );
  assert.ok(
    postManagerSrc.includes("All Categories"),
    "Must include All Categories tab"
  );
  assert.ok(
    postManagerSrc.includes("Most Used"),
    "Must include Most Used tab"
  );
  assert.ok(
    postManagerSrc.includes("+ Add New Category"),
    "Must allow adding new categories"
  );

  // Featured Image Box
  assert.ok(
    postManagerSrc.includes("renderFeaturedImageBox"),
    "Must render Featured Image meta box"
  );
  assert.ok(
    postManagerSrc.includes("Crop Cover"),
    "Must support cropping featured image"
  );
});

test("Classic Editor: clicking old post or page directly loads old content for editing", () => {
  // Table row click
  assert.ok(
    postManagerSrc.includes("onClick={() => openEdit(item)}"),
    "Every row must trigger openEdit when clicked"
  );

  // openEdit populates fields
  assert.ok(
    postManagerSrc.includes("openEdit = (item: UnifiedContentItem)"),
    "openEdit must accept any UnifiedContentItem"
  );

  // Pages in WordPressAdmin can open Classic Editor directly
  assert.ok(
    wpAdminSrc.includes("Edit in Classic Editor"),
    "All Website Pages section must provide Edit in Classic Editor tool"
  );
  assert.ok(
    wpAdminSrc.includes("geocam:open-edit-page-id"),
    "Must dispatch event to open page in Classic Editor"
  );

  // Dual Language support
  assert.ok(
    postManagerSrc.includes('handleSwitchLang("en")'),
    "Must support switching to English source"
  );
  assert.ok(
    postManagerSrc.includes('handleSwitchLang("km")'),
    "Must support switching to Khmer translation"
  );
  assert.ok(
    postManagerSrc.includes("Fill Known Khmer Phrases"),
    "Must support filling known Khmer phrases"
  );
});

test("CSS: wp-admin.css includes authentic Classic Editor typography and canvas styling", () => {
  assert.ok(
    wpAdminCss.includes("geocam-classic-editor-canvas"),
    "Must define styling for classic editor canvas"
  );
  assert.ok(
    wpAdminCss.includes("wp-classic-editor-overlay"),
    "Must define background for classic editor overlay"
  );
});
