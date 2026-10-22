import zipfile
import xml.etree.ElementTree as ET

zf = zipfile.ZipFile(r"d:\9-Database Information\GeoCam Website\Tectonics\Cambodia_Southeast_Asia_Illustrated_Report.docx")
xml_content = zf.read("word/document.xml")
tree = ET.fromstring(xml_content)

rels_content = zf.read("word/_rels/document.xml.rels")
rels_tree = ET.fromstring(rels_content)
rel_map = {}
for rel in rels_tree:
    rId = rel.attrib.get("Id")
    target = rel.attrib.get("Target")
    if target and "media" in target:
        rel_map[rId] = target.replace("media/", "")

paragraphs = []
for p in tree.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p"):
    texts = [node.text for node in p.iter("{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t") if node.text]
    line = "".join(texts).strip()
    drawings = p.findall(".//{http://schemas.openxmlformats.org/drawingml/2006/main}blip")
    img_ids = [d.attrib.get("{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed") for d in drawings]
    img_files = [rel_map.get(iid) for iid in img_ids if iid in rel_map]
    paragraphs.append({"text": line, "images": img_files})

with open(r"d:\9-Database Information\GeoCam Website\geocam-website\scripts\docx_dump.txt", "w", encoding="utf-8") as f:
    for i, item in enumerate(paragraphs):
        f.write(f"=== [P{i:02d}] ===\n")
        if item["images"]:
            f.write(f"IMAGES: {item['images']}\n")
        f.write(item["text"] + "\n\n")

print(f"Dumped {len(paragraphs)} paragraphs to scripts/docx_dump.txt successfully.")
