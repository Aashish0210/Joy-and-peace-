import json

log_path = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\af1fc8ac-dde2-4863-b4e5-4692ab504e5c\.system_generated\logs\transcript.jsonl"

media_to_find = [
    "media__1781186904222",
    "media__1781186985230",
    "media__1781187112745",
    "media__1781187214406",
    "media__1781190531782",
    "media__1781190692597",
    "media__1781190887846",
    "media__1781191051818",
    "media__1781191212086",
    "media__1781191680382",
    "media__1781191708664",
    "media__1781192636928"
]

print("Searching transcript.jsonl for specific media items...")
with open(log_path, 'r', encoding='utf-8') as f:
    for line_num, line in enumerate(f, 1):
        try:
            data = json.loads(line)
            line_str = json.dumps(data)
            for m in media_to_find:
                if m in line_str:
                    # Let's print the step info and the relevant text
                    print(f"Step {data.get('step_index')} (Line {line_num}): Found {m}")
                    content = str(data.get('content', ''))
                    # Search for m in content and print context
                    idx = content.find(m)
                    if idx != -1:
                        start = max(0, idx - 200)
                        end = min(len(content), idx + 300)
                        print(f"  Context: ...{content[start:end]}...")
                    # Also search if it's in tool calls or tool output
                    for tc in data.get('tool_calls', []):
                        tc_str = json.dumps(tc)
                        if m in tc_str:
                            print(f"  Tool Call Name: {tc.get('name')}")
                            print(f"  Tool Call Args (truncated): {str(tc.get('args'))[:300]}")
                    print("-" * 50)
        except Exception as e:
            pass
