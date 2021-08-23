import type { NextPage } from 'next';
import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Image } from 'react-bootstrap';
import { ArrowRepeat } from 'react-bootstrap-icons';
import styles from '../styles/Home.module.css';

const sampleData = [
  {
    "id": "ember71",
    "name": "Patrick Campbell",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4E03AQFhrcdTHKJbvg/profile-displayphoto-shrink_100_100/0/1522429087940?e=1634774400&v=beta&t=9f0-eWCJhVPb8EgJWoGiAiR7jdxndbMI5IqDscoACoc",
    "text": "Officially out of the COVID woods and back at 100%.\n\nWas very bad second time around.\n\nSome folks asked for any findings so sharing:\n\n1. Protect your immune system with sleep/diet. Dr. said if I wasn't traveling a bunch the week I got it I probably wouldn't have noticed.\n\n2. Get exercise. I've been running/ellipticalling for a while now and I’m not a small human or a marathoner. No matter your size/etc., so something to work the lungs. Dr. said cardio health prevented me from going to hospital.\n\n3. I was vaxxed. You can still get this if you're vaxxed, but won't be as bad. Make your own choices, but I'd get vaxxed.\n\nUltimately follow your doctor’s guidelines and such for you. I’m not a medical professional obviously.\n\nWas bad four weeks, but now back in action. Thanks for the support homies."
  },
  {
    "id": "ember126",
    "name": "Divyaditya S.",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4D03AQE_ExOILcTTBg/profile-displayphoto-shrink_100_100/0/1601520021827?e=1634774400&v=beta&t=jSOG2yRyXiNa37ZZYWKWSM2UyxQ8HQZesVmq45loEl4",
    "text": "Excited to announce Paladin Drones’s first product launch. Thanks for covering it, Danny Crichton!\n\nhttps://lnkd.in/eSd5SZfn\nStay tuned, many more things coming soon ;)"
  },
  {
    "id": "ember244",
    "name": "Andrea B. Kvam",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4E03AQFK_N7cKYZtIA/profile-displayphoto-shrink_100_100/0/1619608121946?e=1634774400&v=beta&t=hbYUI1KKLevqWtQlcVKdUDH1tGMLOUdWsqYtNjWVRJA",
    "text": "And just like that… it’s time for a new exciting adventure at tillit!\n\nRecharged after summer and ready for all the new opportunities that lays ahead together with the impressive Tillit team! I couldn’t have asked for a more interesting new chapter than this, and I’m looking forward to simplify B2B shopping.\n\n—\nAfter almost 5 years at Bambora it is only right that I pay tribute to the company and leaders that gave me numerous growth opportunities, experience, challenges and truly talented colleagues. During the years I’ve had the pleasure to work with teams cross various channels and markets, and seen what a successful cross boarder CEX operation can look like. Thank you all for making my years at Bambora worthwhile!\n\nLastly, I hope you’re Intrigued by what we’re doing at tillit - so check it out!"
  },
  {
    "id": "ember289",
    "name": "Ngozi Okonjo-Iweala",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4D03AQE46jD2vMvxzw/profile-displayphoto-shrink_100_100/0/1614130181731?e=1634774400&v=beta&t=oPbqbZ6TUnqdWr_eORV1qFMclQFKiNRPquVKD2B27V0",
    "text": "I welcome the ruling of the Swiss Press Council calling out the gender bias & sexism of Swiss newspaper Aargauer Zeitung for its headline ‘Grandmother becomes boss of WTO’ upon my appointment. It is right to call out sexism, racism or both when you see it!"
  }
];

const Home: NextPage = () => {
  const [data, setData] = useState<Array<any>>([]);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setData(sampleData);
    } else {
      // seed posts on page load
      chrome.storage.local.get("posts", result => setData(result.posts));
      // add listener for when new data is added
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "get_posts") {
          chrome.storage.local.get("posts", result => setData(result.posts));
        }
      });
    }
  }, []);

  function sendScrollMessage(id: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, { type: "scroll_to", id });
    });
  }

  function sendFillMessage(id: string, text: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, { type: "fill", id, text });
    });
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>Top of Mind</h2>
        {data.length === 0 && <div>
          We haven&lsquo;t found any LinkedIn posts by your connections yet. Keep scrolling LinkedIn until you find one!
        </div>}
        {data.length > 0 && data.map(post => <Card className={styles.card} key={post.id}>
          <Card.Body>
            <Card.Title className={styles.cardTitle}>
              <div>
                <Image className={styles.cardImage} src={post.imageSrc} alt={post.name} roundedCircle />
                <span>{post.name}</span>
              </div>
              <Button variant="light" onClick={() => sendScrollMessage(post.id)}>Go to post</Button>
            </Card.Title>
            <Card.Text className={`text-truncate ${styles.cardText}`}>
              {post.text}
            </Card.Text>
          </Card.Body>
          <hr style={{ margin: 0 }} />
          <Card.Body>
            <Badge bg="secondary">
              Suggested comment
            </Badge>
            <Form.Control as="textarea" className={styles.suggestion} disabled value="Thank you so much for sharing your experience." />
            <div className={styles.buttonContainer}>
              <div>
                <Button variant="light"><ArrowRepeat size={20} /></Button>
                <Button onClick={() => sendFillMessage(post.id, "Thank you so much for sharing your experience.")}>Fill</Button>
              </div>
            </div>
          </Card.Body>
        </Card>)}
      </main>
    </div>
  )
}

export default Home
