import json

log_path = r"C:\Users\LENOVO\.gemini\antigravity-ide\brain\af1fc8ac-dde2-4863-b4e5-4692ab504e5c\.system_generated\logs\transcript.jsonl"

print("Searching user inputs for media...")
with open(log_path, 'r', encoding='utf-8') as f:
    for line in f:
        try:
            data = json.loads(line)
            if data.get('source') == 'USER_EXPLICIT' or data.get('type') == 'USER_INPUT':
                content = str(data.get('content', ''))
                # Print step and content if it mentions image, media, png, jpg, or has attachments
                if any(x in content.lower() for x in ['image', 'media', 'png', 'jpg', 'picture', 'file']):
                    print(f"Step {data.get('step_index')}:")
                    print(f"  Content: {content[:300]}")
                    print("-" * 50)
        except Exception as e:
            pass
