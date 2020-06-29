import { useState } from 'react'
import { EmptyState, Layout, Page } from '@shopify/polaris'
import { ResourcePicker, TitleBar } from '@shopify/app-bridge-react'
import store from 'store-js'
import ResourceListWithProducts from '../components/ResourceList'

const img = 'https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg'

const handleSelection = (resources, setOpenState) => {
  const idsFromResources = resources.selection.map((product) => product.id)

  setOpenState(false)
  store.set('ids', idsFromResources)
}

export const Index = () => {
  const [isOpenState, setOpenState] = useState(false)
  const emptyState = !store.get('ids')

  return (
    <Page>
      <TitleBar
        title="Sample App"
        primaryAction={{
          content: 'Select products',
          onAction: () => setOpenState(true),
        }}
      />
      <ResourcePicker
        resourceType="Product"
        showVariants={false}
        open={isOpenState}
        onSelection={resources => handleSelection(resources, setOpenState)}
        onCancel={() => setOpenState(false)}
      />
      {emptyState ? (
        <Layout>
          <EmptyState
            heading="Discount your products temporarily"
            action={{
              content: 'Select products',
              onAction: () => setOpenState(true),
            }}
            image={img}
          >
            <p>Select products to change their price temporarily.</p>
          </EmptyState>
        </Layout>
      ) : (
          <ResourceListWithProducts />
        )}
    </Page>
  )
}

export default Index
