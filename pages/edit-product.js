import { useState, useEffect } from 'react'
import {
  Banner,
  Card,
  DisplayText,
  Form,
  FormLayout,
  Frame,
  Layout,
  Page,
  PageActions,
  TextField,
  Toast,
} from '@shopify/polaris'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import store from 'store-js'

const UPDATE_PRICE = gql`
  mutation productVariantUpdate($input: ProductVariantInput!) {
    productVariantUpdate(input: $input) {
      product {
        title
      }
      productVariant {
        id
        price
      }
    }
  }
`

class EditProduct extends React.Component {
  static state = {
    discount: '',
    price: '',
    variantId: '',
    showToast: false,
  }

  componentDidMount() {
    this.setState({ discount: this.itemToBeConsumed() })
  }

  handleChange = (field) => {
    return (value) => this.setState({ [field]: value })
  }

  render() {
    const {
      name,
      price,
      discount,
      variantId,
    } = this.state

    return (
      <Mutation
        mutation={UPDATE_PRICE}
      >
        {(handleSubmit, { error, data }) => {
          const showError = error && (
            <Banner status="critical">{error.message}</Banner>
          )
          const showToast = data && data.productVariantUpdate && (
            <Toast
              content="Sucessfully updated"
              onDismiss={() => this.setState({ showToast: false })}
            />
          )
          return (
            <Frame>
              <Page>
                <Layout>
                  {showToast}
                  <Layout.Section>
                    {showError}
                  </Layout.Section>
                  <Layout.Section>
                    <DisplayText size="large">{name}</DisplayText>
                    <Form>
                      <Card sectioned>
                        <FormLayout>
                          <FormLayout.Group>
                            <TextField
                              prefix="$"
                              value={price}
                              disabled
                              label="Original price"
                              type="price"
                            />
                            <TextField
                              prefix="$"
                              value={discount}
                              onChange={this.handleChange('discount')}
                              label="Discounted price"
                              type="discount"
                            />
                          </FormLayout.Group>
                          <p>This sale price will expire in two weeks</p>
                        </FormLayout>
                      </Card>
                      <PageActions
                        primaryAction={[
                          {
                            content: 'Save',
                            onAction: () => {
                              const productVariableInput = {
                                id: variantId,
                                price: discount,
                              }
                              handleSubmit({
                                variables: { input: productVariableInput },
                              })
                            },
                          },
                        ]}
                        secondaryActions={[
                          {
                            content: 'Remove discount',
                          },
                        ]}
                      />
                    </Form>
                  </Layout.Section>
                </Layout>
              </Page>
            </Frame>
          )
        }}
      </Mutation>
    )
  }
}

export default EditProduct
