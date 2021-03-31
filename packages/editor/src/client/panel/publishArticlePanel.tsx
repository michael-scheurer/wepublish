import React, {useState} from 'react'

import {ArticleMetadata} from './articleMetadataPanel'

import {useTranslation} from 'react-i18next'
import {Button, ControlLabel, DatePicker, Form, FormGroup, Message, Modal} from 'rsuite'

import {DescriptionList, DescriptionListItem} from '../atoms/descriptionList'

export interface PublishArticlePanelProps {
  initialPublishDate?: Date
  pendingPublishDate?: Date
  metadata: ArticleMetadata

  onClose(): void
  onConfirm(publishDate: Date, updateDate: Date): void
}

export function PublishArticlePanel({
  initialPublishDate,
  pendingPublishDate,
  metadata,
  onClose,
  onConfirm
}: PublishArticlePanelProps) {
  const now = new Date()

  const [publishDate, setPublishDate] = useState<Date | undefined>(initialPublishDate ?? now)
  const [updateDate, setUpdateDate] = useState<Date | undefined>(now)

  const {t} = useTranslation()

  return (
    <>
      <Modal.Header>
        <Modal.Title>{t('articleEditor.panels.publishArticle')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {pendingPublishDate && (
          <Message
            type="warning"
            description={t('articleEditor.panels.articlePending', {pendingPublishDate})}
          />
        )}
        <Form fluid={true}>
          <FormGroup>
            <ControlLabel>{t('articleEditor.panels.publishTime')}</ControlLabel>
            <DatePicker
              style={{width: 100, marginRight: 8}}
              placement="auto"
              value={publishDate}
              format="HH:mm"
              ranges={[
                {
                  label: t('articleEditor.panels.now'),
                  value: new Date()
                }
              ]}
              onChange={publishDate => setPublishDate(publishDate)}
            />
            <DatePicker
              style={{width: 130}}
              placement="auto"
              value={publishDate}
              format="DD MMM YY"
              ranges={[
                {
                  label: t('articleEditor.panels.now'),
                  value: new Date()
                }
              ]}
              onChange={publishDate => setPublishDate(publishDate)}
            />
          </FormGroup>
          <FormGroup>
            <ControlLabel>{t('articleEditor.panels.updateTime')}</ControlLabel>
            <DatePicker
              style={{width: 100, marginRight: 8}}
              value={updateDate}
              format="HH:mm"
              ranges={[
                {
                  label: t('articleEditor.panels.now'),
                  value: new Date()
                }
              ]}
              onChange={updateDate => setUpdateDate(updateDate)}
            />
            <DatePicker
              style={{width: 130}}
              placement="auto"
              value={updateDate}
              format="DD MMM YY"
              ranges={[
                {
                  label: t('articleEditor.panels.now'),
                  value: new Date()
                }
              ]}
              onChange={updateDate => setUpdateDate(updateDate)}
            />
          </FormGroup>
        </Form>

        <DescriptionList>
          <DescriptionListItem label={t('articleEditor.panels.preTitle')}>
            {metadata.preTitle || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.title')}>
            {metadata.title || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.lead')}>
            {metadata.lead || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.seoTitle')}>
            {metadata.seoTitle || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.slug')}>
            {metadata.slug || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.tags')}>
            {metadata.tags.join(', ') || '-'}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.breakingNews')}>
            {metadata.breaking ? t('articleEditor.panels.yes') : t('articleEditor.panels.no')}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.sharedWithPeers')}>
            {metadata.shared ? t('articleEditor.panels.yes') : t('articleEditor.panels.no')}
          </DescriptionListItem>
          <DescriptionListItem label={t('articleEditor.panels.hideAuthors')}>
            {metadata.hideAuthor ? t('articleEditor.panels.yes') : t('articleEditor.panels.no')}
          </DescriptionListItem>
        </DescriptionList>
      </Modal.Body>

      <Modal.Footer>
        <Button
          appearance="primary"
          disabled={!publishDate || !updateDate}
          onClick={() => onConfirm(publishDate!, updateDate!)}>
          {t('articleEditor.panels.confirm')}
        </Button>
        <Button appearance="subtle" onClick={() => onClose()}>
          {t('articleEditor.panels.close')}
        </Button>
      </Modal.Footer>
    </>
  )
}
