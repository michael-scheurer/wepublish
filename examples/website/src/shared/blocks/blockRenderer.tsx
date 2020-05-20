import {Block, BlockType, PublishedArticle, TeaserType, Author} from '../types'
import React, {ReactNode} from 'react'
import {EmbedBlock} from './embedBlock'
import {GalleryBlock} from './galleryBlock'
import {GridBlock} from './gridBlock'
import {ImageBlock} from './imageBlock'
import {QuoteBlock} from './quoteBlock'
import {RichTextBlock} from './richTextBlock'
import {BreakingTeaser} from '../teasers/breakingTeaser'
import {DefaultTeaser} from '../teasers/defaultTeaser'
import {ImageTeaser} from '../teasers/imageTeaser'
import {TextTeaser} from '../teasers/textTeaser'
import {ArticleRoute} from '../route/routeContext'
import {PageBreakBlock} from './peerPageBreak'
import {ListicalBLock} from './listicalBlock'
import {TitleBlock} from './titleBlock'
import {TitleImageBlock} from './titleBlockImage'

export interface BlockRendererProps {
  blocks: Block[]
  authors?: Author[]
  publishedAt: Date
  updatedAt: Date
  children?(blockElement: JSX.Element | null): ReactNode
  articleShareUrl?: string
  isArticle?: boolean
}

export function BlockRenderer({blocks, children, ...props}: BlockRendererProps) {
  return (
    <>
      {blocks.map(block =>
        block ? (
          <React.Fragment key={block.key}>
            {children ? children(renderBlock(block, props)) : renderBlock(block, props)}
          </React.Fragment>
        ) : null
      )}
    </>
  )
}

export interface RenderBlockOptions {
  authors?: Author[]
  publishedAt: Date
  updatedAt: Date
  articleShareUrl?: string
  isArticle?: boolean
}

export function renderBlock(block: Block | null, opts: RenderBlockOptions) {
  const {authors, publishedAt, updatedAt, articleShareUrl, isArticle} = opts

  if (!block) return null

  switch (block.type) {
    case BlockType.RichText:
      return <RichTextBlock value={block.value} />

    case BlockType.Gallery:
      return <GalleryBlock media={block.value.media} />

    case BlockType.Embed:
      return <EmbedBlock data={block.value} />

    case BlockType.Grid:
      return (
        <GridBlock numColumns={block.value.numColumns}>
          {block.value.blocks.map(block => renderBlock(block, opts))}
        </GridBlock>
      )

    case BlockType.Quote:
      return <QuoteBlock author={block.value.author} text={block.value.text} />

    case BlockType.Image:
      return (
        <ImageBlock
          src={block.value.format === 'gif' ? block.value.url : block.value.largeURL}
          width={1280}
          height={700}
          description={block.value.description}
          caption={block.value.caption}
          author={block.value.author}
        />
      )

    case BlockType.TitleImage:
      return <TitleImageBlock image={block.value} width={1280} height={680} />

    case BlockType.Teaser:
      return renderTeaser(block.key, block.value)

    case BlockType.PeerPageBreak:
      return (
        <PageBreakBlock
          text={block.value.text}
          linkURL={block.value.linkURL}
          linkText={block.value.linkText}
          isArticle={isArticle}
        />
      )

    case BlockType.Listicle:
      return <ListicalBLock listical={block.value} />

    case BlockType.Quote:
      return <QuoteBlock text={block.value.text} author={block.value.author} />

    case BlockType.Title:
      return (
        <TitleBlock
          shareUrl={articleShareUrl || ''}
          preTitle={block.value.preTitle}
          type={block.value.type}
          title={block.value.title}
          lead={block.value.lead}
          authors={authors}
          publishedAt={publishedAt}
          updatedAt={updatedAt}
          showSocialMediaIcons={block.value.isHeader}
        />
      )

    default:
      return null
  }
}

function renderTeaser(key: string, article: PublishedArticle) {
  function getTeaserTags(tags: string[], max: number): string[] {
    let result = []
    for (let i = 0; i < tags.length && i < max; i++) {
      result.push(tags[i])
    }
    return result
  }

  switch (article.teaserType) {
    case TeaserType.Default:
    default:
      return (
        <DefaultTeaser
          key={key}
          preTitle={article.preTitle}
          title={article.title}
          lead={article.lead}
          isUpdated={article.updatedAt.getTime() !== article.publishedAt.getTime()}
          date={article.updatedAt}
          image={article.image}
          peer={article.peer}
          tags={getTeaserTags(article.tags, 3)}
          route={ArticleRoute.create({id: article.id, slug: article.slug})}
          authors={article.authors}
          isSingle={true}
        />
      )

    case TeaserType.Light:
      return (
        <ImageTeaser
          key={key}
          preTitle={article.preTitle}
          title={article.title}
          date={article.publishedAt}
          image={article.image}
          peer={article.peer}
          tags={getTeaserTags(article.tags, 3)}
          route={ArticleRoute.create({id: article.id, slug: article.slug})}
          authors={article.authors}
        />
      )

    case TeaserType.Text:
      return (
        <TextTeaser
          key={key}
          preTitle={article.preTitle}
          title={article.title}
          date={article.publishedAt}
          lead={article.lead}
          peer={article.peer}
          tags={getTeaserTags(article.tags, 3)}
          route={ArticleRoute.create({id: article.id, slug: article.slug})}
          authors={article.authors}
        />
      )

    case TeaserType.Breaking:
      return (
        <BreakingTeaser
          key={key}
          title={article.title}
          preTitle={article.preTitle}
          date={article.publishedAt}
          route={ArticleRoute.create({id: article.id, slug: article.slug})}
        />
      )
  }
}