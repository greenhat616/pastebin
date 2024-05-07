/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Icon, chakra, shouldForwardProp } from '@chakra-ui/react'
import { AnimatePresence, isValidMotionProp, motion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import {
  JSXElementConstructor,
  ReactElement,
  SVGProps,
  useEffect,
  useMemo,
  useState
} from 'react'

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
  index: number
  setIndex: (index: number) => void
}

const emojis = [
  ['face-with-tears-of-joy', IFluentEmojiFlatFaceWithTearsOfJoy],
  ['grinning-squinting-face', IFluentEmojiFlatGrinningSquintingFace],
  ['face-with-symbols-on-mouth', IFluentEmojiFlatFaceWithSymbolsOnMouth],
  ['zany-face', IFluentEmojiFlatZanyFace],
  ['woozy-face', IFluentEmojiFlatWoozyFace],
  [
    'beaming-face-with-smiling-eyes',
    IFluentEmojiFlatBeamingFaceWithSmilingEyes
  ],
  ['clown-face', IFluentEmojiFlatClownFace],
  ['exploding-head', IFluentEmojiFlatExplodingHead],
  ['face-with-diagonal-mouth', IFluentEmojiFlatFaceWithDiagonalMouth],
  ['angry-face', IFluentEmojiFlatAngryFace],
  ['face-holding-back-tears', IFluentEmojiFlatFaceHoldingBackTears],
  ['anxious-face-with-sweat', IFluentEmojiFlatAnxiousFaceWithSweat],
  ['downcast-face-with-sweat', IFluentEmojiFlatDowncastFaceWithSweat],
  ['face-savoring-food', IFluentEmojiFlatFaceSavoringFood],
  ['grinning-face-with-big-eyes', IFluentEmojiFlatGrinningFaceWithBigEyes],
  ['hot-face', IFluentEmojiFlatHotFace],
  ['loudly-crying-face', IFluentEmojiFlatLoudlyCryingFace],
  ['lying-face', IFluentEmojiFlatLyingFace],
  ['ghost', IFluentEmojiFlatGhost],
  ['grinning-face-with-sweat', IFluentEmojiFlatGrinningFaceWithSweat],
  ['knocked-out-face', IFluentEmojiFlatKnockedOutFace],
  ['face-with-raised-eyebrow', IFluentEmojiFlatFaceWithRaisedEyebrow],
  ['face-with-rolling-eyes', IFluentEmojiFlatFaceWithRollingEyes],
  ['partying-face', IFluentEmojiFlatPartyingFace],
  ['smirking-face', IFluentEmojiFlatSmirkingFace],
  ['smiling-face-with-sunglasses', IFluentEmojiFlatSmilingFaceWithSunglasses]
] as Array<
  [
    string,
    (
      props: SVGProps<SVGSVGElement>
    ) => ReactElement<any, string | JSXElementConstructor<any>>
  ]
>

function Emoji(props: EmojiProps) {
  const { index, setIndex } = props
  const extraProps = useMemo(
    () => ({
      className: classNames('w-10 h-10', props.className)
    }),
    [props]
  )

  const mergedEmojis = useMemo(
    () =>
      emojis.map((emoji) => (
        <Icon key={emoji[0]} as={emoji[1]} {...extraProps} />
      )),
    [extraProps]
  )

  const [isClient, setIsClient] = useState(false) // prevent SSR
  const pathname = usePathname()
  // random pick emoji while route change
  const [prevPathname, setPrevPathname] = useState(pathname)
  if (prevPathname !== pathname) {
    setPrevPathname(pathname)
    setIndex(Math.floor(Math.random() * emojis.length))
  }

  useEffect(() => {
    // prevent SSR
    setIsClient(true)
  }, [])

  return <>{isClient && mergedEmojis[index]}</>
}

export type AnimatedLogoProps = {
  className?: string
  emojiClassName?: string
}

export default function AnimatedLogo(props: AnimatedLogoProps) {
  const [index, setIndex] = useState(Math.floor(Math.random() * emojis.length))
  return (
    <AnimatePresence>
      <ChakraBox
        key={index}
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
        <Emoji
          className={props.emojiClassName}
          index={index}
          setIndex={setIndex}
        />
      </ChakraBox>
    </AnimatePresence>
  )
}
