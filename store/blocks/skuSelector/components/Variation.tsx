import React, { FC, memo, useState, Fragment, useCallback, useMemo } from 'react'
import { Button } from 'vtex.styleguide'
import { findIndex, propEq } from 'ramda'
import classnames from 'classnames'
import useProduct from 'vtex.product-context/useProduct'
import { ResponsiveInput } from 'vtex.responsive-values'

import { stripUrl, isColor, slug } from '../utils'
import styles from '../styles.css'
import { DisplayVariation, DisplayMode } from '../types'
import { imageUrlForSize, VARIATION_IMG_SIZE } from '../utils/images'
import ErrorMessage from './ErrorMessage'
import SelectModeVariation from './SelectVariationMode'
import SelectorItem from './SelectorItem'
import SelectGoToProduct from './SelectGoToProduct'
import RamdaCore from 'chefcompany.store-utils/ramdaCore';

const { pathOr } = RamdaCore;

interface Props {
  variation: DisplayVariation
  maxSkuPrice?: number | null
  seeMoreLabel: string
  maxItems: number
  selectedItem: string | null
  showValueForVariation: boolean
  imageHeight?: number
  imageWidth?: number
  showBorders?: boolean
  showLabel: boolean
  containerClasses?: string
  showErrorMessage: boolean
  mode?: string
  sliderDisplayThreshold: number
  sliderArrowSize: number
  sliderItemsPerPage: ResponsiveInput<number>
  showColorValue?: boolean
  onGoToProduct: () => void
  maxItemsPerProduct: number
  summary: boolean
  showAllVariation: boolean
}

const ITEMS_VISIBLE_THRESHOLD = 2

const findSelectedOption = (selectedItem: string | null) =>
  findIndex(propEq('label', selectedItem))

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noop = () => {}

const Variation: FC<Props> = ({
  mode = 'default',
  maxItems,
  showLabel,
  variation,
  imageWidth,
  imageHeight,
  showBorders,
  maxSkuPrice,
  seeMoreLabel,
  selectedItem,
  showErrorMessage,
  showValueForVariation,
  containerClasses: containerClassesProp,
  sliderArrowSize,
  sliderDisplayThreshold,
  sliderItemsPerPage,
  showColorValue,
  onGoToProduct,
  maxItemsPerProduct,
  summary,
  showAllVariation
}) => {
  const { originalName, name, options } = variation

  const visibleItemsWhenCollapsed = maxItems - ITEMS_VISIBLE_THRESHOLD

  const [showAll, setShowAll] = useState(() => {
    const selectedOptionPosition = findSelectedOption(selectedItem)(options)

    return selectedOptionPosition >= visibleItemsWhenCollapsed
  })

  const displayImage = isColor(originalName)

  const originalNameSplited = useMemo( () => {
    const n = selectedItem ? selectedItem.split('-') : '';
    const response = pathOr('Sin color', [1], n)
    if (displayImage) {
      return response
    }
    return selectedItem;
  }, [selectedItem]);

  const [showGoToPage, setShowGoToPage] = useState<boolean>(false);

  const {
    buyButton = {
      clicked: false,
    },
  } = useProduct()

  const shouldCollapse = !showAll && options.length > maxItems

  const displayOptions = useMemo(() => {

    if (options.length <= maxItemsPerProduct || !summary || showAllVariation) {
      return options
    }


    setShowGoToPage(true);
    return options.slice(0, maxItemsPerProduct - 1)

  }, [options, maxItemsPerProduct])
  
  /*options.slice(
    0,
    shouldCollapse ? visibleItemsWhenCollapsed : options.length
  ) */ 

  const showAllAction = useCallback(() => setShowAll(true), [setShowAll])
  const containerClasses = classnames(
    'flex flex-column',
    containerClassesProp,
    styles.skuSelectorSubcontainer,
    `${styles.skuSelectorSubcontainer}--${slug(originalName)}`
  )

  const shouldUseSlider =
    displayOptions.length > sliderDisplayThreshold &&
    mode === DisplayMode.slider

  const selectorItemsArray = displayOptions.map(option => {
    return (
      <SelectorItem
        isSelected={option.label === selectedItem}
        key={`${option.label}-${name}`}
        isAvailable={option.available}
        maxPrice={maxSkuPrice}
        onClick={option.impossible ? noop : option.onSelectItem}
        isImage={displayImage}
        variationValue={option.label}
        variationValueOriginalName={option.originalName}
        imageHeight={imageHeight}
        imageWidth={imageWidth}
        showBorders={showBorders}
        imageUrl={
          option.image &&
          imageUrlForSize(stripUrl(option.image.imageUrl), VARIATION_IMG_SIZE)
        }
        imageLabel={option.image?.imageLabel}
        isImpossible={option.impossible}
        type={name}
        showColorValue={showColorValue}
      />
    )
  })

  return (
    <div className={containerClasses}>
      <div className={`${styles.skuSelectorNameContainer} ma1`}>
        <div className={`${styles.skuSelectorTextContainer} db mb3`}>
          {showLabel && (
            <span
              className={`${styles.skuSelectorName} c-muted-1 t-small overflow-hidden`}
            >
              {name}
              {showErrorMessage && buyButton.clicked && !selectedItem && (
                <ErrorMessage />
              )}
            </span>
          )}
          {originalNameSplited && showValueForVariation && showLabel && (
            <Fragment>
              <span
                className={`${styles.skuSelectorNameSeparator} c-muted-1 t-small`}
              >
                :{' '}
              </span>
              <span
                className={`${styles.skuSelectorSelectorImageValue} c-muted-1 t-small`}
              >
                {originalNameSplited}
              </span>
            </Fragment>
          )}
        </div>
        <div
          className={`${styles.skuSelectorOptionsList} w-100 inline-flex flex-wrap ml2 items-center`}
        >
          {mode === DisplayMode.select && !displayImage ? (
            <SelectModeVariation
              selectedItem={selectedItem}
              displayOptions={displayOptions}
            />
          ) : shouldUseSlider ? selectorItemsArray
           : (
            selectorItemsArray
          )}
          {showGoToPage && (<SelectGoToProduct onGoToProduct={onGoToProduct}/>)}
          {!showAll && shouldCollapse && (
            <div className={styles.seeMoreButton}>
              <Button
                variation="tertiary"
                onClick={showAllAction}
                size="small"
                collapseLeft
              >
                Mostar mas
              </Button>
            </div>
          )}
          </div>
      </div>
    </div>
  )
}

export default memo(Variation)
