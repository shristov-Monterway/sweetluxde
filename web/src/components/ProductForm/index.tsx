import React from 'react';
import {
  ProductBadgeType,
  ProductBadgeTypeType,
  ProductType,
} from '../../../../types/internal/ProductType';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import TranslationFormField from '../TranslationFormField';
import ListFormField from '../ListFormField';
import FormField from '../FormField';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { ProductCreateUpdateRequestType } from '../../../../types/api/admin/ProductCreateUpdateRequestType';
import { ProductCreateUpdateResponseType } from '../../../../types/api/admin/ProductCreateUpdateResponseType';
import Expandable from '../Expandable';

export interface ProductFormProps extends AbstractComponentType {
  product?: ProductType;
}

const ProductForm = (props: ProductFormProps): React.JSX.Element => {
  const id = 'product';
  const app = useApp();
  const uid = props.product ? props.product.uid : undefined;
  const product: Omit<ProductType, 'uid'> = props.product
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uid, ...product } = props.product;
        return product;
      })()
    : {
        name: {},
        description: {},
        variations: {
          default: {
            name: {},
            description: {},
            price: 10000,
            images: [],
          },
        },
        tags: [],
        badge: undefined,
      };
  const productBadgeTypes = ['success', 'danger', 'info', 'warning'];
  const [newProduct, setNewProduct] =
    React.useState<Omit<ProductType, 'uid'>>(product);
  const [badgeStatus, setBadgeStatus] = React.useState<'enabled' | ''>(
    newProduct.badge ? 'enabled' : ''
  );
  const [badge, setBadge] = React.useState<ProductBadgeType>({
    type: newProduct.badge ? newProduct.badge.type : 'success',
    text: newProduct.badge ? newProduct.badge.text : {},
  });
  const [newVariationId, setNewVariationId] = React.useState<string>('');
  const [productFieldExpandableId, setProductFieldExpandableId] =
    React.useState<string | undefined>(undefined);
  const [productVariationExpandableId, setProductVariationExpandableId] =
    React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (badgeStatus === 'enabled') {
      setNewProduct((newProduct) => ({
        ...newProduct,
        badge: badge,
      }));
    } else {
      setNewProduct((newProduct) => ({
        ...newProduct,
        badge: undefined,
      }));
    }
  }, [badgeStatus, badge]);

  const onSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    console.log(newProduct);

    const response = await FirebaseFunctionsModule<
      ProductCreateUpdateRequestType,
      ProductCreateUpdateResponseType
    >().call(
      '/admin/product/createUpdate',
      {
        product: newProduct,
        uid,
      },
      app.translator.locale,
      app.currency.get
    );

    console.log(response.product);
  };

  return (
    <form
      className={`form product-form ${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    >
      <Expandable
        value={productFieldExpandableId}
        setValue={(value) => setProductFieldExpandableId(value)}
        elements={[
          {
            id: 'name',
            label: 'Name',
            children: (
              <TranslationFormField
                form="product"
                field="name"
                translations={newProduct.name}
                setTranslations={(translations) => {
                  setNewProduct((newProduct) => ({
                    ...newProduct,
                    name: translations,
                  }));
                }}
              />
            ),
          },
          {
            id: 'description',
            label: 'Description',
            children: (
              <TranslationFormField
                form="product"
                field="description"
                translations={newProduct.description}
                setTranslations={(translations) => {
                  setNewProduct((newProduct) => ({
                    ...newProduct,
                    description: translations,
                  }));
                }}
                type="textarea"
                inputAttributes={{
                  rows: '5',
                }}
              />
            ),
          },
          {
            id: 'tags',
            label: 'Tags',
            children: (
              <ListFormField
                form="product"
                field="tags"
                list={newProduct.tags}
                setList={(list) => {
                  setNewProduct((newProduct) => ({
                    ...newProduct,
                    tags: list,
                  }));
                }}
                newItem={{}}
                type="translation"
                max={5}
              />
            ),
          },
          {
            id: 'badge',
            label: 'Badge',
            children: (
              <div className="d-flex flex-column gap-3">
                <FormField
                  form="product"
                  field="badgeStatus"
                  type="checkbox"
                  value={badgeStatus}
                  setValue={(value) => setBadgeStatus(value as 'enabled' | '')}
                  selectOptions={[
                    {
                      label: app.translator.t(
                        'form.product.badgeStatus.option.enabled.label'
                      ),
                      value: 'enabled',
                      help: app.translator.t(
                        'form.product.badgeStatus.option.enabled.help'
                      ),
                    },
                  ]}
                />
                {badgeStatus === 'enabled' ? (
                  <>
                    <FormField
                      form="product"
                      field="badgeType"
                      type="select"
                      value={badge.type}
                      setValue={(value) =>
                        setBadge((badge) => ({
                          ...badge,
                          type: value as ProductBadgeTypeType,
                        }))
                      }
                      selectOptions={productBadgeTypes.map((option) => ({
                        label: option,
                        value: option,
                      }))}
                    />
                    <TranslationFormField
                      form="product"
                      field="badgeText"
                      translations={badge.text}
                      setTranslations={(translations) => {
                        setBadge((badge) => ({
                          ...badge,
                          text: translations,
                        }));
                      }}
                    />
                  </>
                ) : null}
              </div>
            ),
          },
          {
            id: 'variations',
            label: 'Variations',
            children: (
              <div className="d-flex flex-column gap-5">
                {Object.keys(newProduct.variations).length > 0 ? (
                  <Expandable
                    value={productVariationExpandableId}
                    setValue={(value) => setProductVariationExpandableId(value)}
                    elements={Object.keys(newProduct.variations).map(
                      (variationId) => ({
                        id: variationId,
                        label: (
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{variationId}</span>
                            {Object.keys(newProduct.variations).length > 1 ? (
                              <button
                                className="btn btn-outline-danger btn-sm"
                                type="button"
                                onClick={() => {
                                  setNewProduct((newProduct) => {
                                    const newVariations = newProduct.variations;
                                    delete newVariations[variationId];
                                    return {
                                      ...newProduct,
                                      variations: newVariations,
                                    };
                                  });
                                }}
                              >
                                <i className="fe fe-minus-circle" />
                              </button>
                            ) : null}
                          </div>
                        ),
                        children: (
                          <div className="d-flex flex-column gap-3">
                            <TranslationFormField
                              form="product"
                              field="productVariationName"
                              translations={
                                newProduct.variations[variationId].name
                              }
                              setTranslations={(translations) => {
                                setNewProduct((newProduct) => ({
                                  ...newProduct,
                                  variations: {
                                    ...newProduct.variations,
                                    [variationId]: {
                                      ...newProduct.variations[variationId],
                                      name: translations,
                                    },
                                  },
                                }));
                              }}
                            />
                            <TranslationFormField
                              form="product"
                              field="productVariationDescription"
                              translations={
                                newProduct.variations[variationId].description
                              }
                              setTranslations={(translations) => {
                                setNewProduct((newProduct) => ({
                                  ...newProduct,
                                  variations: {
                                    ...newProduct.variations,
                                    [variationId]: {
                                      ...newProduct.variations[variationId],
                                      description: translations,
                                    },
                                  },
                                }));
                              }}
                              type="textarea"
                              inputAttributes={{
                                rows: '5',
                              }}
                            />
                            <FormField
                              form="product"
                              field="productVariationPrice"
                              type="text"
                              value={newProduct.variations[
                                variationId
                              ].price.toString()}
                              setValue={(value) => {
                                const parsedValue = parseInt(value);
                                if (
                                  !isNaN(parsedValue) &&
                                  value === '' + parsedValue
                                ) {
                                  setNewProduct((newProduct) => ({
                                    ...newProduct,
                                    variations: {
                                      ...newProduct.variations,
                                      [variationId]: {
                                        ...newProduct.variations[variationId],
                                        price: parsedValue,
                                      },
                                    },
                                  }));
                                }
                              }}
                            />
                            <ListFormField
                              form="product"
                              field="productVariationImages"
                              list={newProduct.variations[variationId].images}
                              setList={(list) => {
                                setNewProduct((newProduct) => ({
                                  ...newProduct,
                                  variations: {
                                    ...newProduct.variations,
                                    [variationId]: {
                                      ...newProduct.variations[variationId],
                                      images: list,
                                    },
                                  },
                                }));
                              }}
                              newItem=""
                              type="text"
                            />
                          </div>
                        ),
                      })
                    )}
                    labelClassName="border-bottom p-3"
                    itemClassName="p-3"
                    className="d-flex flex-column gap-3"
                  />
                ) : null}
                <div className="d-flex align-items-center gap-3">
                  <FormField
                    form="product"
                    field="productVariationId"
                    type="text"
                    value={newVariationId}
                    setValue={(value) => setNewVariationId(value)}
                    className="flex-grow-1"
                  />
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setNewProduct((newProduct) => ({
                        ...newProduct,
                        variations: {
                          ...newProduct.variations,
                          [newVariationId]: {
                            name: {},
                            description: {},
                            price: 10000,
                            images: [],
                          },
                        },
                      }));
                      setProductVariationExpandableId(newVariationId);
                      setNewVariationId('');
                    }}
                  >
                    <i className="fe fe-plus-circle" />
                  </button>
                </div>
              </div>
            ),
          },
        ]}
        labelClassName="border-bottom p-3"
        itemClassName="p-5"
        className="d-flex flex-column gap-3"
      />
      <button type="submit" className="btn btn-primary">
        {app.translator.t(`form.submit.${id}`)}
      </button>
    </form>
  );
};

export default ProductForm;
