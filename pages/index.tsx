import type { NextPage } from 'next';
import React, { useEffect, useRef, useState } from 'react';
import { Form } from 'react-bootstrap';
import PostComponent from '../components/post';
import styles from '../styles/Home.module.css';

const sampleData = [
  {
    "id": "ember71",
    "name": "Patrick Campbell",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4E03AQFhrcdTHKJbvg/profile-displayphoto-shrink_100_100/0/1522429087940?e=1634774400&v=beta&t=9f0-eWCJhVPb8EgJWoGiAiR7jdxndbMI5IqDscoACoc",
    "text": "Officially out of the COVID woods and back at 100%.\n\nWas very bad second time around.\n\nSome folks asked for any findings so sharing:\n\n1. Protect your immune system with sleep/diet. Dr. said if I wasn't traveling a bunch the week I got it I probably wouldn't have noticed.\n\n2. Get exercise. I've been running/ellipticalling for a while now and I’m not a small human or a marathoner. No matter your size/etc., so something to work the lungs. Dr. said cardio health prevented me from going to hospital.\n\n3. I was vaxxed. You can still get this if you're vaxxed, but won't be as bad. Make your own choices, but I'd get vaxxed.\n\nUltimately follow your doctor’s guidelines and such for you. I’m not a medical professional obviously.\n\nWas bad four weeks, but now back in action. Thanks for the support homies.",
    "firstOrder": true,
  },
  {
    "id": "ember126",
    "name": "Divyaditya S.",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4D03AQE_ExOILcTTBg/profile-displayphoto-shrink_100_100/0/1601520021827?e=1634774400&v=beta&t=jSOG2yRyXiNa37ZZYWKWSM2UyxQ8HQZesVmq45loEl4",
    "text": "Excited to announce Paladin Drones’s first product launch. Thanks for covering it, Danny Crichton!\n\nhttps://lnkd.in/eSd5SZfn\nStay tuned, many more things coming soon ;)",
    "firstOrder": false,
  },
  {
    "id": "ember244",
    "name": "Andrea B. Kvam",
    "imageSrc": "https://media-exp1.licdn.com/dms/image/C4E03AQFK_N7cKYZtIA/profile-displayphoto-shrink_100_100/0/1619608121946?e=1634774400&v=beta&t=hbYUI1KKLevqWtQlcVKdUDH1tGMLOUdWsqYtNjWVRJA",
    "text": "And just like that… it’s time for a new exciting adventure at tillit!\n\nRecharged after summer and ready for all the new opportunities that lays ahead together with the impressive Tillit team! I couldn’t have asked for a more interesting new chapter than this, and I’m looking forward to simplify B2B shopping.\n\n—\nAfter almost 5 years at Bambora it is only right that I pay tribute to the company and leaders that gave me numerous growth opportunities, experience, challenges and truly talented colleagues. During the years I’ve had the pleasure to work with teams cross various channels and markets, and seen what a successful cross boarder CEX operation can look like. Thank you all for making my years at Bambora worthwhile!\n\nLastly, I hope you’re Intrigued by what we’re doing at tillit - so check it out!",
    "firstOrder": false,
  },
  {
    "id": "ember289",
    "name": "Ngozi Okonjo-Iweala",
    "imageSrc": null,
    "text": "I welcome the ruling of the Swiss Press Council calling out the gender bias & sexism of Swiss newspaper Aargauer Zeitung for its headline ‘Grandmother becomes boss of WTO’ upon my appointment. It is right to call out sexism, racism or both when you see it!",
    "firstOrder": false,
  }
];

const Home: NextPage = () => {
  const endOfPageRef = useRef<any>();
  const [data, setData] = useState<Array<any>>([]);
  const [suggestedComments, setSuggestedComments] = useState<Record<string, string[]>>({});
  const [firstOrderOnly, setFirstOrderOnly] = useState(false);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      setData(sampleData);
    } else {
      // add listener for when new data is added
      chrome.runtime.onMessage.addListener((msg) => {
        if (msg.type === "new_posts") {
          // only set data if there's new posts to avoid auto-scroll to the bottom of the extension if the user is
          // actually scrolling up on the LinkedIn page
          setData(prevData => msg.posts.length > prevData.length ? msg.posts : prevData);
        }
      });
      // seed posts on page load
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id as number, { type: "get_posts" });
      });
    }
  }, []);

  useEffect(() => {
    endOfPageRef.current?.scrollIntoView({ behavior: "smooth" });
    const commentsNeeded = data.filter(p => !suggestedComments[p.id]);
    if (commentsNeeded.length === 0) {
      return;
    }
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"}/api/getSuggestedComments`, {
      method: 'post',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(commentsNeeded),
    })
      .then(res => res.json())
      .then(jsonRes => setSuggestedComments(prevValue => ({ ...prevValue, ...jsonRes })));
  }, [data]);  // eslint-disable-line react-hooks/exhaustive-deps

  const filteredData = data.filter(d => firstOrderOnly ? d.firstOrder : true);
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h2>Top of Mind</h2>
        <Form.Check
          type="switch"
          id="first-order-switch"
          label="Only show posts by 1st connections"
          checked={firstOrderOnly}
          onChange={() => setFirstOrderOnly(!firstOrderOnly)}
        />
        {filteredData.length === 0 && <div>
          We haven&lsquo;t found any LinkedIn posts by your connections yet. Keep scrolling LinkedIn until you find one!
        </div>}
        {filteredData.length > 0 &&
          <div>
            {filteredData.map(post => <PostComponent key={post.id} post={post} suggestedComments={suggestedComments[post.id]} />)}
            <div ref={endOfPageRef}>Keep scrolling LinkedIn to load more posts and AI-generated responses!</div>
          </div>
        }
      </main>
    </div>
  )
}

export default Home
