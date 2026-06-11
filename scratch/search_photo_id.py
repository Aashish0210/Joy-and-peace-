import re

file_path = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\af1fc8ac-dde2-4863-b4e5-4692ab504e5c\.system_generated\steps\162\content.md"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Let's search for 553043042 or 552643938 in the content and print context
photo_id = "552643938"
matches = list(re.finditer(photo_id, content))
print(f"Matches for {photo_id}: {len(matches)}")
for m in matches[:3]:
    start = max(0, m.start() - 150)
    end = min(len(content), m.end() + 150)
    print(content[start:end])
    print("-" * 50)
