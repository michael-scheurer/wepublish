import {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLID,
  GraphQLList,
  GraphQLString,
  GraphQLEnumType,
  GraphQLInputObjectType,
  GraphQLBoolean,
  GraphQLInt
} from 'graphql'

import {GraphQLDateTime} from 'graphql-iso-date'

import {Context} from '../context'

import {GraphQLImage} from './image'
import {GraphQLAuthor} from './author'
import {PublicArticle, ArticleRevision, Article, ArticleSort} from '../db/article'
import {GraphQLSlug} from './slug'
import {GraphQLPageInfo} from './common'
import {GraphQLBlockInput, GraphQLBlock, GraphQLPublicBlock} from './blocks'

export const GraphQLArticleFilter = new GraphQLInputObjectType({
  name: 'ArticleFilter',
  fields: {
    title: {type: GraphQLString},
    draft: {type: GraphQLBoolean},
    published: {type: GraphQLBoolean},
    pending: {type: GraphQLBoolean},
    authors: {type: GraphQLList(GraphQLNonNull(GraphQLString))},
    tags: {type: GraphQLList(GraphQLNonNull(GraphQLString))}
  }
})

export const GraphQLPublicArticleFilter = new GraphQLInputObjectType({
  name: 'ArticleFilter',
  fields: {
    authors: {type: GraphQLList(GraphQLNonNull(GraphQLString))},
    tags: {type: GraphQLList(GraphQLNonNull(GraphQLString))}
  }
})

export const GraphQLArticleSort = new GraphQLEnumType({
  name: 'ArticleSort',
  values: {
    CREATED_AT: {value: ArticleSort.CreatedAt},
    MODIFIED_AT: {value: ArticleSort.ModifiedAt},
    PUBLISH_AT: {value: ArticleSort.PublishAt},
    PUBLISHED_AT: {value: ArticleSort.PublishedAt},
    UPDATED_AT: {value: ArticleSort.UpdatedAt}
  }
})

export const GraphQLPublicArticleSort = new GraphQLEnumType({
  name: 'ArticleSort',
  values: {
    PUBLISHED_AT: {value: ArticleSort.PublishedAt},
    UPDATED_AT: {value: ArticleSort.UpdatedAt}
  }
})

export const GraphQLArticleInput = new GraphQLInputObjectType({
  name: 'ArticleInput',
  fields: {
    slug: {type: GraphQLNonNull(GraphQLSlug)},

    preTitle: {type: GraphQLString},
    title: {type: GraphQLNonNull(GraphQLString)},
    lead: {type: GraphQLString},
    tags: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))},

    imageID: {type: GraphQLID},
    authorIDs: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLID)))},

    shared: {type: GraphQLNonNull(GraphQLBoolean)},
    breaking: {type: GraphQLNonNull(GraphQLBoolean)},

    blocks: {
      type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLBlockInput)))
    }
  }
})

export const GraphQLArticleRevision = new GraphQLObjectType<ArticleRevision, Context>({
  name: 'ArticleRevision',
  fields: {
    revision: {type: GraphQLNonNull(GraphQLInt)},

    createdAt: {type: GraphQLNonNull(GraphQLDateTime)},
    publishAt: {type: GraphQLDateTime},

    updatedAt: {type: GraphQLDateTime},
    publishedAt: {type: GraphQLDateTime},

    preTitle: {type: GraphQLString},
    title: {type: GraphQLNonNull(GraphQLString)},
    lead: {type: GraphQLString},
    slug: {type: GraphQLNonNull(GraphQLSlug)},
    tags: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))},

    image: {
      type: GraphQLImage,
      resolve({imageID}, args, {loaders}, info) {
        return imageID ? loaders.images.load(imageID) : null
      }
    },

    authors: {
      type: GraphQLNonNull(GraphQLList(GraphQLAuthor)),
      resolve({authorIDs}, args, {loaders}) {
        return Promise.all(authorIDs.map(authorID => loaders.authorsByID.load(authorID)))
      }
    },

    breaking: {type: GraphQLNonNull(GraphQLBoolean)},
    blocks: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLBlock)))}
  }
})

export const GraphQLArticle = new GraphQLObjectType<Article, Context>({
  name: 'Article',
  fields: {
    id: {type: GraphQLNonNull(GraphQLID)},
    shared: {type: GraphQLNonNull(GraphQLBoolean)},

    createdAt: {type: GraphQLNonNull(GraphQLDateTime)},
    modifiedAt: {type: GraphQLNonNull(GraphQLDateTime)},

    draft: {type: GraphQLArticleRevision},
    published: {type: GraphQLArticleRevision},
    pending: {type: GraphQLArticleRevision},

    latest: {
      type: GraphQLNonNull(GraphQLArticleRevision),
      resolve({draft, pending, published}) {
        return draft ?? pending ?? published
      }
    }

    // TODO: Implement article history
    // history: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLArticleRevision)))}
  }
})

export const GraphQLArticleConnection = new GraphQLObjectType({
  name: 'ArticleConnection',
  fields: {
    nodes: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLArticle)))},
    pageInfo: {type: GraphQLNonNull(GraphQLPageInfo)},
    totalCount: {type: GraphQLNonNull(GraphQLInt)}
  }
})

export const GraphQLPublicArticle: GraphQLObjectType<
  PublicArticle,
  Context
> = new GraphQLObjectType<PublicArticle, Context>({
  name: 'Article',
  fields: {
    id: {type: GraphQLNonNull(GraphQLID)},

    updatedAt: {type: GraphQLNonNull(GraphQLDateTime)},
    publishedAt: {type: GraphQLNonNull(GraphQLDateTime)},

    slug: {type: GraphQLNonNull(GraphQLSlug)},

    url: {
      type: GraphQLNonNull(GraphQLString),
      resolve(article, {}, {urlAdapter}) {
        return urlAdapter.getPublicArticleURL(article)
      }
    },

    preTitle: {type: GraphQLString},
    title: {type: GraphQLNonNull(GraphQLString)},
    lead: {type: GraphQLString},
    tags: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLString)))},

    image: {
      type: GraphQLImage,
      resolve({imageID}, args, {loaders}, info) {
        return imageID ? loaders.images.load(imageID) : null
      }
    },

    authors: {
      type: GraphQLNonNull(GraphQLList(GraphQLAuthor)),
      resolve({authorIDs}, args, {loaders}) {
        return Promise.all(authorIDs.map(authorID => loaders.authorsByID.load(authorID)))
      }
    },

    breaking: {type: GraphQLNonNull(GraphQLBoolean)},
    blocks: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLPublicBlock)))}
  }
})

export const GraphQLPublicArticleConnection = new GraphQLObjectType({
  name: 'ArticleConnection',
  fields: {
    nodes: {type: GraphQLNonNull(GraphQLList(GraphQLNonNull(GraphQLPublicArticle)))},
    pageInfo: {type: GraphQLNonNull(GraphQLPageInfo)},
    totalCount: {type: GraphQLNonNull(GraphQLInt)}
  }
})