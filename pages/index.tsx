import type { NextPage } from 'next';
import { useEffect, useState } from 'react';
import styles from '../styles/Home.module.css';


const Home: NextPage = () => {
  const [data, setData] = useState({});

  useEffect(() => {
    chrome.runtime.onMessage.addListener((msg) => setData(msg));
  });
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {Object.entries(data).map(([id, postText]) => <div key={id}>{postText as string}</div>)}
      </main>
    </div>
  )
}

export default Home
