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
  onSuccess?: () => void;
  onFailure?: (error: Error) => void;
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
            weight: 1000000,
            images: [],
            attributes: {},
          },
        },
        tags: [],
        badge: null,
        categoryUids: [],
        publishedDate: Date.now(),
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
  const [productFieldExpandableId, setProductFieldExpandableId] =
    React.useState<string | undefined>(undefined);
  const [newVariationId, setNewVariationId] = React.useState<string>('');
  const [
    productAttributeFieldExpandableId,
    setProductAttributeFieldExpandableId,
  ] = React.useState<string | undefined>(undefined);
  const [productVariationExpandableId, setProductVariationExpandableId] =
    React.useState<string | undefined>(undefined);
  const [newAttributeId, setNewAttributeId] = React.useState<string>('');
  const [productAttributesExpandableId, setProductAttributesExpandableId] =
    React.useState<string | undefined>(undefined);
  const [newAttributeOptionId, setNewAttributeOptionId] =
    React.useState<string>('');
  const [
    productAttributeOptionExpandableId,
    setProductAttributeOptionExpandableId,
  ] = React.useState<string | undefined>(undefined);
  const [categoryNames, setCategoryNames] = React.useState<{
    [categoryId: string]: string;
  }>(
    app.categories.reduce(
      (categoryNames, category) => ({
        ...categoryNames,
        [category.uid]: category.name[app.translator.locale]
          ? category.name[app.translator.locale]
          : category.name[Object.keys(category.name)[0]],
      }),
      {}
    )
  );

  React.useEffect(() => {
    setCategoryNames(
      app.categories.reduce(
        (categoryNames, category) => ({
          ...categoryNames,
          [category.uid]: category.name[app.translator.locale]
            ? category.name[app.translator.locale]
            : category.name[Object.keys(category.name)[0]],
        }),
        {}
      )
    );
  }, [app.translator.locale, app.categories]);

  React.useEffect(() => {
    if (badgeStatus === 'enabled') {
      setNewProduct((newProduct) => ({
        ...newProduct,
        badge: badge,
      }));
    } else {
      setNewProduct((newProduct) => ({
        ...newProduct,
        badge: null,
      }));
    }
  }, [badgeStatus, badge]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    FirebaseFunctionsModule<
      ProductCreateUpdateRequestType,
      ProductCreateUpdateResponseType
    >()
      .call(
        '/admin/product/createUpdate',
        {
          product: newProduct,
          uid,
        },
        app.translator.locale,
        app.currency.get
      )
      .then(() => {
        if (props.onSuccess) {
          props.onSuccess();
        }
      })
      .catch(() => {
        if (props.onFailure) {
          props.onFailure(new Error('Error managing product.'));
        }
      });
  };

  return (
    <form
      className={`form ${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    >
      <Expandable
        value={productFieldExpandableId}
        setValue={(value) => setProductFieldExpandableId(value)}
        elements={[
          {
            id: 'name',
            label: app.translator.t('components.productForm.name'),
            children: (
              <TranslationFormField
                form={id}
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
            label: app.translator.t('components.productForm.description'),
            children: (
              <TranslationFormField
                form={id}
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
            label: app.translator.t('components.productForm.tags'),
            children: (
              <ListFormField
                form={id}
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
            label: app.translator.t('components.productForm.badge'),
            children: (
              <div className="d-flex flex-column gap-3">
                <FormField
                  form={id}
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
                      form={id}
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
                      form={id}
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
            id: 'categories',
            label: app.translator.t('components.productForm.categories'),
            children: (
              <div className="d-flex flex-column gap-3">
                <ListFormField
                  form={id}
                  field="categories"
                  list={newProduct.categoryUids}
                  setList={(list) => {
                    setNewProduct((newProduct) => ({
                      ...newProduct,
                      categories: list,
                    }));
                  }}
                  newItem=""
                  type="select"
                  selectOptions={Object.keys(categoryNames).map(
                    (categoryId) => ({
                      label: categoryNames[categoryId],
                      value: categoryId,
                    })
                  )}
                />
              </div>
            ),
          },
          {
            id: 'variations',
            label: app.translator.t('components.productForm.variations'),
            children: (
              <div className="d-flex flex-column gap-3">
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
                          <Expandable
                            value={productAttributeFieldExpandableId}
                            setValue={(value) =>
                              setProductAttributeFieldExpandableId(value)
                            }
                            elements={[
                              {
                                id: 'productVariationName',
                                label: app.translator.t(
                                  'components.productForm.productVariationName'
                                ),
                                children: (
                                  <TranslationFormField
                                    form={id}
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
                                            ...newProduct.variations[
                                              variationId
                                            ],
                                            name: translations,
                                          },
                                        },
                                      }));
                                    }}
                                  />
                                ),
                              },
                              {
                                id: 'productVariationDescription',
                                label: app.translator.t(
                                  'components.productForm.productVariationDescription'
                                ),
                                children: (
                                  <TranslationFormField
                                    form={id}
                                    field="productVariationDescription"
                                    translations={
                                      newProduct.variations[variationId]
                                        .description
                                    }
                                    setTranslations={(translations) => {
                                      setNewProduct((newProduct) => ({
                                        ...newProduct,
                                        variations: {
                                          ...newProduct.variations,
                                          [variationId]: {
                                            ...newProduct.variations[
                                              variationId
                                            ],
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
                                ),
                              },
                              {
                                id: 'productVariationPrice',
                                label: app.translator.t(
                                  'components.productForm.productVariationPrice'
                                ),
                                children: (
                                  <FormField
                                    form={id}
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
                                              ...newProduct.variations[
                                                variationId
                                              ],
                                              price: parsedValue,
                                            },
                                          },
                                        }));
                                      }
                                    }}
                                  />
                                ),
                              },
                              {
                                id: 'productVariationImages',
                                label: app.translator.t(
                                  'components.productForm.productVariationImages'
                                ),
                                children: (
                                  <ListFormField
                                    form={id}
                                    field="productVariationImages"
                                    list={
                                      newProduct.variations[variationId].images
                                    }
                                    setList={(list) => {
                                      setNewProduct((newProduct) => ({
                                        ...newProduct,
                                        variations: {
                                          ...newProduct.variations,
                                          [variationId]: {
                                            ...newProduct.variations[
                                              variationId
                                            ],
                                            images: list,
                                          },
                                        },
                                      }));
                                    }}
                                    newItem=""
                                    type="text"
                                  />
                                ),
                              },
                              {
                                id: 'productVariationAttributes',
                                label: app.translator.t(
                                  'components.productForm.productVariationAttributes'
                                ),
                                children: (
                                  <div className="d-flex flex-column gap-3">
                                    {Object.keys(
                                      newProduct.variations[variationId]
                                        .attributes
                                    ).length > 0 ? (
                                      <Expandable
                                        value={productAttributesExpandableId}
                                        setValue={(value) =>
                                          setProductAttributesExpandableId(
                                            value
                                          )
                                        }
                                        elements={Object.keys(
                                          newProduct.variations[variationId]
                                            .attributes
                                        ).map((attributeId) => ({
                                          id: attributeId,
                                          label: (
                                            <div className="d-flex justify-content-between align-items-center">
                                              <span>{attributeId}</span>
                                              <button
                                                className="btn btn-outline-danger btn-sm"
                                                type="button"
                                                onClick={() => {
                                                  setNewProduct(
                                                    (newProduct) => {
                                                      const newAttributes =
                                                        newProduct.variations[
                                                          variationId
                                                        ].attributes;
                                                      delete newAttributes[
                                                        attributeId
                                                      ];
                                                      return {
                                                        ...newProduct,
                                                        variations: {
                                                          ...newProduct.variations,
                                                          [variationId]: {
                                                            ...newProduct
                                                              .variations[
                                                              variationId
                                                            ],
                                                            attributes:
                                                              newAttributes,
                                                          },
                                                        },
                                                      };
                                                    }
                                                  );
                                                }}
                                              >
                                                <i className="fe fe-minus-circle" />
                                              </button>
                                            </div>
                                          ),
                                          children: (
                                            <div className="d-flex flex-column gap-3">
                                              <TranslationFormField
                                                form={id}
                                                field="productAttributeName"
                                                translations={
                                                  newProduct.variations[
                                                    variationId
                                                  ].attributes[attributeId].name
                                                }
                                                setTranslations={(
                                                  translations
                                                ) => {
                                                  setNewProduct(
                                                    (newProduct) => ({
                                                      ...newProduct,
                                                      variations: {
                                                        ...newProduct.variations,
                                                        [variationId]: {
                                                          ...newProduct
                                                            .variations[
                                                            variationId
                                                          ],
                                                          attributes: {
                                                            ...newProduct
                                                              .variations[
                                                              variationId
                                                            ].attributes,
                                                            [attributeId]: {
                                                              ...newProduct
                                                                .variations[
                                                                variationId
                                                              ].attributes[
                                                                attributeId
                                                              ],
                                                              name: translations,
                                                            },
                                                          },
                                                        },
                                                      },
                                                    })
                                                  );
                                                }}
                                              />
                                              <div className="d-flex flex-column gap-3">
                                                {Object.keys(
                                                  newProduct.variations[
                                                    variationId
                                                  ].attributes[attributeId]
                                                    .options
                                                ).length > 0 ? (
                                                  <Expandable
                                                    value={
                                                      productAttributeOptionExpandableId
                                                    }
                                                    setValue={(value) =>
                                                      setProductAttributeOptionExpandableId(
                                                        value
                                                      )
                                                    }
                                                    elements={Object.keys(
                                                      newProduct.variations[
                                                        variationId
                                                      ].attributes[attributeId]
                                                        .options
                                                    ).map((optionId) => ({
                                                      id: optionId,
                                                      label: (
                                                        <div className="d-flex justify-content-between align-items-center">
                                                          <span>
                                                            {optionId}
                                                          </span>
                                                          <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            type="button"
                                                            onClick={() => {
                                                              setNewProduct(
                                                                (
                                                                  newProduct
                                                                ) => {
                                                                  const newOptions =
                                                                    newProduct
                                                                      .variations[
                                                                      variationId
                                                                    ]
                                                                      .attributes[
                                                                      attributeId
                                                                    ].options;
                                                                  delete newOptions[
                                                                    optionId
                                                                  ];
                                                                  return {
                                                                    ...newProduct,
                                                                    variations:
                                                                      {
                                                                        ...newProduct.variations,
                                                                        [variationId]:
                                                                          {
                                                                            ...newProduct
                                                                              .variations[
                                                                              variationId
                                                                            ],
                                                                            attributes:
                                                                              {
                                                                                ...newProduct
                                                                                  .variations[
                                                                                  variationId
                                                                                ]
                                                                                  .attributes,
                                                                                [attributeId]:
                                                                                  {
                                                                                    ...newProduct
                                                                                      .variations[
                                                                                      variationId
                                                                                    ]
                                                                                      .attributes[
                                                                                      attributeId
                                                                                    ],
                                                                                    options:
                                                                                      newOptions,
                                                                                  },
                                                                              },
                                                                          },
                                                                      },
                                                                  };
                                                                }
                                                              );
                                                            }}
                                                          >
                                                            <i className="fe fe-minus-circle" />
                                                          </button>
                                                        </div>
                                                      ),
                                                      children: (
                                                        <div className="d-flex flex-column gap-3">
                                                          <TranslationFormField
                                                            form={id}
                                                            field="productAttributeOptionName"
                                                            translations={
                                                              newProduct
                                                                .variations[
                                                                variationId
                                                              ].attributes[
                                                                attributeId
                                                              ].options[
                                                                optionId
                                                              ].name
                                                            }
                                                            setTranslations={(
                                                              translations
                                                            ) => {
                                                              setNewProduct(
                                                                (
                                                                  newProduct
                                                                ) => ({
                                                                  ...newProduct,
                                                                  variations: {
                                                                    ...newProduct.variations,
                                                                    [variationId]:
                                                                      {
                                                                        ...newProduct
                                                                          .variations[
                                                                          variationId
                                                                        ],
                                                                        attributes:
                                                                          {
                                                                            ...newProduct
                                                                              .variations[
                                                                              variationId
                                                                            ]
                                                                              .attributes,
                                                                            [attributeId]:
                                                                              {
                                                                                ...newProduct
                                                                                  .variations[
                                                                                  variationId
                                                                                ]
                                                                                  .attributes[
                                                                                  attributeId
                                                                                ],
                                                                                options:
                                                                                  {
                                                                                    ...newProduct
                                                                                      .variations[
                                                                                      variationId
                                                                                    ]
                                                                                      .attributes[
                                                                                      attributeId
                                                                                    ]
                                                                                      .options,
                                                                                    [optionId]:
                                                                                      {
                                                                                        ...newProduct
                                                                                          .variations[
                                                                                          variationId
                                                                                        ]
                                                                                          .attributes[
                                                                                          attributeId
                                                                                        ]
                                                                                          .options[
                                                                                          optionId
                                                                                        ],
                                                                                        name: translations,
                                                                                      },
                                                                                  },
                                                                              },
                                                                          },
                                                                      },
                                                                  },
                                                                })
                                                              );
                                                            }}
                                                          />
                                                        </div>
                                                      ),
                                                    }))}
                                                    labelClassName="border-bottom p-3"
                                                    itemClassName="ps-5 py-5"
                                                    canLabelExpand={true}
                                                    className="d-flex flex-column gap-3"
                                                  />
                                                ) : null}
                                                <div className="d-flex align-items-center gap-3">
                                                  <FormField
                                                    form={id}
                                                    field="productAttributeOptionId"
                                                    type="text"
                                                    value={newAttributeOptionId}
                                                    setValue={(value) =>
                                                      setNewAttributeOptionId(
                                                        value
                                                      )
                                                    }
                                                    className="flex-grow-1"
                                                  />
                                                  <button
                                                    className="btn btn-primary"
                                                    type="button"
                                                    onClick={() => {
                                                      setNewProduct(
                                                        (newProduct) => ({
                                                          ...newProduct,
                                                          variations: {
                                                            ...newProduct.variations,
                                                            [variationId]: {
                                                              ...newProduct
                                                                .variations[
                                                                variationId
                                                              ],
                                                              attributes: {
                                                                ...newProduct
                                                                  .variations[
                                                                  variationId
                                                                ].attributes,
                                                                [attributeId]: {
                                                                  ...newProduct
                                                                    .variations[
                                                                    variationId
                                                                  ].attributes[
                                                                    attributeId
                                                                  ],
                                                                  options: {
                                                                    ...newProduct
                                                                      .variations[
                                                                      variationId
                                                                    ]
                                                                      .attributes[
                                                                      attributeId
                                                                    ].options,
                                                                    [newAttributeOptionId]:
                                                                      {
                                                                        name: {},
                                                                      },
                                                                  },
                                                                },
                                                              },
                                                            },
                                                          },
                                                        })
                                                      );
                                                      setProductAttributeOptionExpandableId(
                                                        newAttributeOptionId
                                                      );
                                                      setNewAttributeOptionId(
                                                        ''
                                                      );
                                                    }}
                                                  >
                                                    <i className="fe fe-plus-circle" />
                                                  </button>
                                                </div>
                                              </div>
                                            </div>
                                          ),
                                        }))}
                                        labelClassName="border-bottom p-3"
                                        itemClassName="ps-5 py-5"
                                        canLabelExpand={true}
                                        className="d-flex flex-column gap-3"
                                      />
                                    ) : null}
                                    <div className="d-flex align-items-center gap-3">
                                      <FormField
                                        form={id}
                                        field="productAttributeId"
                                        type="text"
                                        value={newAttributeId}
                                        setValue={(value) =>
                                          setNewAttributeId(value)
                                        }
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
                                              [variationId]: {
                                                ...newProduct.variations[
                                                  variationId
                                                ],
                                                attributes: {
                                                  ...newProduct.variations[
                                                    variationId
                                                  ].attributes,
                                                  [newAttributeId]: {
                                                    name: {},
                                                    options: {},
                                                  },
                                                },
                                              },
                                            },
                                          }));
                                          setProductAttributesExpandableId(
                                            newAttributeId
                                          );
                                          setNewAttributeId('');
                                        }}
                                      >
                                        <i className="fe fe-plus-circle" />
                                      </button>
                                    </div>
                                  </div>
                                ),
                              },
                              {
                                id: 'productVariationWeight',
                                label: app.translator.t(
                                  'components.productForm.productVariationWeight'
                                ),
                                children: (
                                  <div className="d-flex flex-column gap-3">
                                    <FormField
                                      form={id}
                                      field="productVariationWeightStatus"
                                      type="checkbox"
                                      value={
                                        newProduct.variations[variationId]
                                          .weight !== null
                                          ? 'enabled'
                                          : ''
                                      }
                                      setValue={(value) =>
                                        setNewProduct((newProduct) => ({
                                          ...newProduct,
                                          variations: {
                                            ...newProduct.variations,
                                            [variationId]: {
                                              ...newProduct.variations[
                                                variationId
                                              ],
                                              weight:
                                                value === 'enabled'
                                                  ? 10000
                                                  : null,
                                            },
                                          },
                                        }))
                                      }
                                      selectOptions={[
                                        {
                                          label: app.translator.t(
                                            'form.product.productVariationWeightStatus.option.enabled.label'
                                          ),
                                          value: 'enabled',
                                          help: app.translator.t(
                                            'form.product.productVariationWeightStatus.option.enabled.help'
                                          ),
                                        },
                                      ]}
                                    />
                                    {newProduct.variations[variationId]
                                      .weight !== null ? (
                                      <>
                                        <FormField
                                          form={id}
                                          field="productVariationWeight"
                                          type="text"
                                          value={newProduct.variations[
                                            variationId
                                          ].weight.toString()}
                                          setValue={(value) =>
                                            setNewProduct((newProduct) => ({
                                              ...newProduct,
                                              variations: {
                                                ...newProduct.variations,
                                                [variationId]: {
                                                  ...newProduct.variations[
                                                    variationId
                                                  ],
                                                  weight: !isNaN(
                                                    parseInt(value, 10)
                                                  )
                                                    ? parseInt(value, 10)
                                                    : newProduct.variations[
                                                        variationId
                                                      ].weight,
                                                },
                                              },
                                            }))
                                          }
                                        />
                                      </>
                                    ) : null}
                                  </div>
                                ),
                              },
                            ]}
                            labelClassName="border-bottom p-3"
                            itemClassName="ps-5 py-5"
                            canLabelExpand={true}
                            className="d-flex flex-column gap-3"
                          />
                        ),
                      })
                    )}
                    labelClassName="border-bottom p-3"
                    itemClassName="ps-5 py-5"
                    canLabelExpand={true}
                    className="d-flex flex-column gap-3"
                  />
                ) : null}
                <div className="d-flex align-items-center gap-3">
                  <FormField
                    form={id}
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
                            weight: 1000000,
                            images: [],
                            attributes: {},
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
        itemClassName="ps-5 py-5"
        canLabelExpand={true}
        className="d-flex flex-column gap-3"
      />
      <button type="submit" className="btn btn-primary">
        {app.translator.t(`form.submit.${id}`)}
      </button>
    </form>
  );
};

export default ProductForm;
