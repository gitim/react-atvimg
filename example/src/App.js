import React from 'react'
import ATVImg from 'react-atvimg'
import styles from './styles.module.css'
import backImage from './back.png'

export default function App() {
  return (
    <div>
      <ATVImg
        className={styles.example}
        layers={[
          <div
            className={styles.backLayer}
            key="back"
            style={{
              backgroundImage: `url(${backImage})`,
            }}
          />,
          <div className={styles.frontLayer} key="front">
            React ATVImg
          </div>
        ]}
      />
      <ATVImg
        className={styles.example}
        style={{
          width: 200,
          height: 60,
        }}
        layers={[
          <div
            className={styles.backLayer}
            key="back"
            style={{
              background: 'red',
            }}
          />,
          <div className={styles.frontLayer} key="front">
            React ATVImg
          </div>
        ]}
      />
    </div>
  )
}
