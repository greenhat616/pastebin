'use client'
import { Icon, chakra, shouldForwardProp } from '@chakra-ui/react'
import { isValidMotionProp, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

// ChakraBox is Icon wrapper of motion.div
const ChakraBox = chakra(motion.div, {
  /**
   * Allow motion props and non-ChakrIcon props to be forwarded.
   */
  shouldForwardProp: (prop) =>
    isValidMotionProp(prop) || shouldForwardProp(prop)
})

type EmojiProps = {
  className?: string
}

function Emoji(props: EmojiProps) {
  const extraProps = {
    className: classNames('w-10 h-10', props.className)
  }

  const emojis = [
    <Icon
      key="face-with-tears-of-joy"
      as={IFluentEmojiFlatFaceWithTearsOfJoy}
      {...extraProps}
    />,
    <Icon
      key="grinning-squinting-face"
      as={IFluentEmojiFlatGrinningSquintingFace}
      {...extraProps}
    />,
    <Icon
      key="face-with-symbols-on-mouth"
      as={IFluentEmojiFlatFaceWithSymbolsOnMouth}
      {...extraProps}
    />,
    <Icon key="zany-face" as={IFluentEmojiFlatZanyFace} {...extraProps} />,
    <Icon key="woozy-face" as={IFluentEmojiFlatWoozyFace} {...extraProps} />,
    <Icon
      key="beaming-face-with-smiling-eyes"
      as={IFluentEmojiFlatBeamingFaceWithSmilingEyes}
      {...extraProps}
    />,
    <Icon key="clown-face" as={IFluentEmojiFlatClownFace} {...extraProps} />,
    <Icon
      key="exploding-head"
      as={IFluentEmojiFlatExplodingHead}
      {...extraProps}
    />,
    <Icon
      key="face-with-diagonal-mouth"
      as={IFluentEmojiFlatFaceWithDiagonalMouth}
      {...extraProps}
    />,
    <Icon key="angry-face" as={IFluentEmojiFlatAngryFace} {...extraProps} />,
    <Icon
      key="face-holding-back-tears"
      as={IFluentEmojiFlatFaceHoldingBackTears}
      {...extraProps}
    />,
    <Icon
      key="anxious-face-with-sweat"
      as={IFluentEmojiFlatAnxiousFaceWithSweat}
      {...extraProps}
    />,
    <Icon
      key="downcast-face-with-sweat"
      as={IFluentEmojiFlatDowncastFaceWithSweat}
      {...extraProps}
    />,
    <Icon
      key="face-savoring-food"
      as={IFluentEmojiFlatFaceSavoringFood}
      {...extraProps}
    />,
    <Icon
      key="grinning-face-with-big-eyes"
      as={IFluentEmojiFlatGrinningFaceWithBigEyes}
      {...extraProps}
    />,
    <Icon key="hot-face" as={IFluentEmojiFlatHotFace} {...extraProps} />,
    <Icon
      key="loudly-crying-face"
      as={IFluentEmojiFlatLoudlyCryingFace}
      {...extraProps}
    />,
    <Icon key="lying-face" as={IFluentEmojiFlatLyingFace} {...extraProps} />,
    <Icon key="ghost" as={IFluentEmojiFlatGhost} {...extraProps} />,
    <Icon
      key="grinning-face-with-sweat"
      as={IFluentEmojiFlatGrinningFaceWithSweat}
      {...extraProps}
    />,
    <Icon
      key="knocked-out-face"
      as={IFluentEmojiFlatKnockedOutFace}
      {...extraProps}
    />,
    <Icon
      key="face-with-raised-eyebrow"
      as={IFluentEmojiFlatFaceWithRaisedEyebrow}
      {...extraProps}
    />,
    <Icon
      key="face-with-rolling-eyes"
      as={IFluentEmojiFlatFaceWithRollingEyes}
      {...extraProps}
    />,
    <Icon
      key="partying-face"
      as={IFluentEmojiFlatPartyingFace}
      {...extraProps}
    />,
    <Icon
      key="smirking-face"
      as={IFluentEmojiFlatSmirkingFace}
      {...extraProps}
    />,
    <Icon
      key="smiling-face-with-sunglasses"
      as={IFluentEmojiFlatSmilingFaceWithSunglasses}
      {...extraProps}
    />
  ]

  const [index, setIndex] = useState(Math.floor(Math.random() * emojis.length))
  const [isClient, setIsClient] = useState(false) // prevent SSR
  const pathname = usePathname()
  // random pick emoji while route change
  useEffect(() => {
    setIndex(Math.floor(Math.random() * emojis.length))

    // Disable eslint warning because emojis.length is not a dependency
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])
  useEffect(() => {
    // prevent SSR
    setIsClient(true)
  }, [])

  return <>{isClient && emojis[index]}</>
}

type Props = {
  className?: string
  emojiClassName?: string
}

export default function AnimatedLogo(props: Props) {
  return (
    <ChakraBox
      initial={{ scale: 0 }}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore no problem in operation, although type error appears.
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20
      }}
      animate={{ scale: 1, rotate: 360 }}
      whileHover={{ scale: 1.2, rotate: 0 }}
      whileTap={{ scale: 0.8, rotate: -90 }}
      as={motion.div}
      className={classNames('w-10 h-10', props.className)}
    >
      <Emoji className={props.emojiClassName} />
    </ChakraBox>
  )
}
