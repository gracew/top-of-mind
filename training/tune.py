# fine tunes the open ai model to classify linkedin posts based on suggested action:
# - Congratulate: Congratulations!
# - Acknowledge: Very interesting. Thank you for sharing.
# - Share: Great. I will share with my network.

import json
import csv
from pprint import pprint

openai.api_key = os.getenv("OPENAI_API_KEY")

# get training posts
# Array.prototype.slice.call(document.getElementsByClassName("feed-shared-update-v2")).filter(el => el.querySelector(".feed-shared-actor__sub-description")?.innerText !== "Promoted").map(el => el.querySelector(".feed-shared-text span span")?.innerText)
with open("raw_posts.json", "r") as f:
    raw_posts_json = json.load(f)

# save as csv
raw_posts_json = [{"completion": "", "prompt": " ".join([i for i in x.splitlines() if i])} for x in raw_posts_json if x]
with open("raw_posts.csv", "w") as f:
    csv_writer = csv.writer(f)
    count = 0
    for post in raw_posts_json:
        if count == 0:
            header = post.keys()
            csv_writer.writerow(header)
            count += 1
        csv_writer.writerow(post.values())

# openai tools fine_tunes.prepare_data -f classified_posts.csv
# openai api fine_tunes.create -t "classified_posts_prepared_train.jsonl" -v "classified_posts_prepared_valid.jsonl" -m ada --no_packing --compute_classification_metrics --classification_n_classes 3
