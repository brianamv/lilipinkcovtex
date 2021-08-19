import React from 'react'
// eslint-disable-next-line no-restricted-imports
import { head } from 'ramda'
import SkuSelector from '../skuSelector/Wrapper';
import { useCssHandles } from 'vtex.css-handles'
import {
  useProductSummaryDispatch,
  useProductSummary,
} from 'vtex.product-summary-context/ProductSummaryContext'

const CSS_HANDLES = ['SKUSelectorContainerSummary']

function ProductSummarySKUSelector(props: any) {
  const stopBubblingUp: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const dispatch = useProductSummaryDispatch()
  const ProductoSummaryContex = useProductSummary()

  const { product } = ProductoSummaryContex;

  const handleSKUSelected = (skuId: string | null) => {
    if (skuId == null) {
      dispatch({
        type: 'SET_PRODUCT_QUERY',
        args: { query: '' },
      })

      return
    }

    const selectedItem =
      product.items && product.items.find((item: any) => item.itemId === skuId)

    const sku = {
      ...selectedItem,
      image: head(selectedItem.images),
      seller: head(selectedItem.sellers),
    }

    const newProduct = {
      ...product,
      selectedItem,
      sku,
    }

    dispatch({
      type: 'SET_PRODUCT',
      args: { product: newProduct },
    })

    dispatch({
      type: 'SET_PRODUCT_QUERY',
      args: { query: `skuId=${skuId}` },
    })
  }

  const handles = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'vtex.store-components@3.x',
  })

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div onClick={stopBubblingUp} className={handles.SKUSelectorContainerSummary}>
      <SkuSelector onSKUSelected={handleSKUSelected} maxItems={99} {...props} summary={true} />
    </div>
  )
}

export default ProductSummarySKUSelector
