import React, { useCallback, useRef, useState } from 'react'

import styles from './styles.module.css'

export interface ATVImageProps
  extends React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  layers: React.ElementType[]
}

export function ATVImage(props: ATVImageProps) {
  const { className, layers } = props

  const isTouchEnabled = false

  const [isMouseOver, setIsMouseOver] = useState(false)
  const [shineStyle, setShineStyle] = useState({})
  const [containerStyle, setContainerStyle] = useState({})
  const [layersStyles, setLayersStyles] = useState<React.CSSProperties[]>([])

  const elementRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = useCallback(() => {
    setIsMouseOver(true)
  }, [])
  const handleMouseMove = useCallback(
    (event) => {
      const element = elementRef.current

      if (!element) return

      const totalLayers = 2
      const bdst = document.body.scrollTop || document.documentElement.scrollTop
      const bdsl = document.body.scrollLeft
      const pageX = isTouchEnabled ? event.touches[0].pageX : event.pageX
      const pageY = isTouchEnabled ? event.touches[0].pageY : event.pageY
      const offsets = element.getBoundingClientRect()
      const width = element.clientWidth || element.offsetWidth || element.scrollWidth // width
      const height = element.clientHeight || element.offsetHeight || element.scrollHeight // height
      const wMultiple = 320 / width
      const offsetX = 0.52 - (pageX - offsets.left - bdsl) / width // cursor position X
      const offsetY = 0.52 - (pageY - offsets.top - bdst) / height // cursor position Y
      const dy = pageY - offsets.top - bdst - height / 2 // @h/2 = center of container
      const dx = pageX - offsets.left - bdsl - width / 2 // @w/2 = center of container
      const yRotate = (offsetX - dx) * (0.07 * wMultiple) // rotation for container Y
      const xRotate = (dy - offsetY) * (0.1 * wMultiple) // rotation for container X
      const containerStyle = {
        transform: `rotateX(${xRotate}deg) rotateY(${yRotate}deg)`, // img transform
      }
      const arad = Math.atan2(dy, dx) // angle between cursor and center of container in RAD
      let angle = (arad * 180) / Math.PI - 90 // convert rad in degrees

      // get angle between 0-360
      if (angle < 0) {
        angle = angle + 360
      }

      // container transform
      if (isMouseOver) {
        containerStyle.transform += ' scale3d(1.07,1.07,1.07)'
      }
      setContainerStyle(containerStyle)

      // gradient angle and opacity for shine
      setShineStyle({
        background: `linear-gradient(${angle}deg, rgba(255,255,255,${
          ((pageY - offsets.top - bdst) / height) * 0.4
        }) 0%,rgba(255,255,255,0) 80%)`,
        transform: `translateX(${offsetX * totalLayers - 0.1}px) translateY(${
          offsetY * totalLayers - 0.1
        }px)`,
      })

      // parallax for each layer
      let revNum = totalLayers
      const layersStyles = [] as React.CSSProperties[]
      for (let ly = 0; ly < totalLayers; ly++) {
        layersStyles.push({
          transform: `translateX(${offsetX * revNum * ((ly * 2.5) / wMultiple)}px) translateY(${
            offsetY * totalLayers * ((ly * 2.5) / wMultiple)
          }px)`,
        })
        revNum--
      }
      setLayersStyles(layersStyles)
    },
    [isMouseOver, isTouchEnabled],
  )
  const handleMouseLeave = useCallback(() => {
    setIsMouseOver(false)
    setShineStyle({})
    setContainerStyle({})
  }, [])

  return (
    <div {...props} className={`${styles.atvimage} ${className}`} ref={elementRef}>
      <div
        className={`${styles.container} ${isMouseOver ? styles.over : ''}`}
        style={containerStyle}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.shadow} />
        <div className={styles.layers}>
          {layers.map((layerContent, index) => (
            <div key={index} className={styles.layer} style={layersStyles[index]}>
              {layerContent}
            </div>
          ))}
        </div>
        <div className={styles.shine} style={shineStyle} />
      </div>
    </div>
  )
}
