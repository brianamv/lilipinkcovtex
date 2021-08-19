import { useMemo } from 'react';
import { useCssHandles, applyModifiers } from 'vtex.css-handles'
import classNames from 'classnames'
import { Icon } from 'vtex.store-icons';

const CSS_HANDLES = [
  'skuSelectorItem',
  'skuSelectorGoToPage',
  'skuSelectorGoToPageIcon'
]

interface Props {
  onGoToProduct: () => void
}

const SelectGoToProduct = ({ onGoToProduct }: Props) => {

  const handles = useCssHandles(CSS_HANDLES, {
    migrationFrom: 'chefcompany.product-details@0.x',
  })

  const containerClasses = useMemo(() =>
      classNames(
        applyModifiers(handles.skuSelectorItem),
        'relative di pointer flex items-center outline-0 ma2',
        applyModifiers(handles.skuSelectorGoToPage)
      ),
    [])

  return <div className={containerClasses} onClick={onGoToProduct}><Icon activeClassName={handles.skuSelectorGoToPageIcon} id="mpa-plus--line"/></div>
}

export default SelectGoToProduct;
