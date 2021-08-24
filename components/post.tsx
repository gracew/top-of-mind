import React, { useEffect, useState } from 'react';
import { Badge, Button, Card, Form, Image, Spinner } from 'react-bootstrap';
import { ArrowRepeat } from 'react-bootstrap-icons';
import styles from '../styles/Post.module.css';

interface Post {
  id: string;
  name: string;
  imageSrc: string;
  text: string;
  firstOrder: boolean;
}

interface PostProps {
  post: Post;
  suggestedComments?: string[];
}

const PostComponent = (props: PostProps) => {
  const { post, suggestedComments } = props;
  const [comment, setComment] = useState<string>();

  useEffect(() => {
    if (suggestedComments && suggestedComments.length > 0) {
      const i = Math.floor(Math.random() * suggestedComments.length);
      setComment(suggestedComments[i]);
    };
  }, [suggestedComments]);

  function sendScrollMessage(id: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, { type: "scroll_to", id });
    });
  }

  function selectNewComment() {
    if (!suggestedComments || suggestedComments.length <= 1) {
      return;
    }
    let newComment = comment;
    while (newComment === comment) {
      const i = Math.floor(Math.random() * suggestedComments.length);
      newComment = suggestedComments[i];
    }
    setComment(newComment);
  }

  function sendFillMessage(id: string, text: string) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id as number, { type: "fill", id, text });
    });
  }

  return (
    <Card className={styles.card}>
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
        {!comment && <div className={styles.spinnerContainer}>
          <Spinner variant="secondary" animation="border" />
        </div>}
        {comment && <div>
          <Form.Control as="textarea" className={styles.suggestion} disabled value={comment} />
          <div className={styles.buttonContainer}>
            <div>
              <Button onClick={selectNewComment} variant="light"><ArrowRepeat size={20} /></Button>
              <Button onClick={() => sendFillMessage(post.id, comment)}>Fill</Button>
            </div>
          </div>
        </div>}
      </Card.Body>
    </Card>
  );
}

export default PostComponent;
