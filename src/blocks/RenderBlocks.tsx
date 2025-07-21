import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { SwiperSliderBlock } from '@/blocks/SwiperSlider/Component'
import { PostsSliderBlock } from '@/blocks/PostsSlider/Component'
import { CollectionSliderBlock } from '@/blocks/CollectionSlider/Component'
import { SimpleCollectionSlider } from '@/blocks/CollectionSlider/SimpleComponent'

const blockComponents: Record<string, React.ComponentType<any>> = {
  archive: ArchiveBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  formBlock: FormBlock,
  mediaBlock: MediaBlock,
  swiperSlider: SwiperSliderBlock,
  postsSlider: PostsSliderBlock,
  collectionSlider: CollectionSliderBlock,
  simpleCollectionSlider: SimpleCollectionSlider,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType]

            if (Block) {
                          return (
              <div className="my-16" key={index}>
                <Block {...block} disableInnerContainer />
              </div>
            )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
