import React from 'react';
import useApp from '../../hooks/useApp';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import FormField from '../FormField';
import { FilterType } from '../../../../types/internal/FilterType';

export interface AttributeFilterProps extends AbstractComponentType {
  filters: FilterType;
  setFilters: (
    newFilters: FilterType | ((filters: FilterType) => FilterType)
  ) => void;
  attributeId: string;
  containerClassName?: string;
}

const AttributeFilter = (
  props: AttributeFilterProps
): React.JSX.Element | null => {
  const app = useApp();
  const [isAttributeReady, setIsAttributeReady] =
    React.useState<boolean>(false);
  const [attributeName, setAttributeName] = React.useState<string>('');
  const [attributeOptionNames, setAttributeOptionNames] = React.useState<{
    [attributeOptionId: string]: string;
  }>({});

  React.useEffect(() => {
    setIsAttributeReady(
      Object.keys(props.filters.attributes).includes(props.attributeId)
    );
  }, [props.filters, props.attributeId]);

  React.useEffect(() => {
    let newAttributeName: string = '';
    const attributeOptionNames: {
      [attributeOptionId: string]: string;
    } = {};
    app.products.get.forEach((product) => {
      Object.keys(product.variations).forEach((variationId) => {
        Object.keys(product.variations[variationId].attributes).forEach(
          (attributeId) => {
            if (attributeId === props.attributeId) {
              newAttributeName = product.variations[variationId].attributes[
                attributeId
              ].name[app.translator.locale]
                ? product.variations[variationId].attributes[attributeId].name[
                    app.translator.locale
                  ]
                : product.variations[variationId].attributes[attributeId].name[
                    Object.keys(
                      product.variations[variationId].attributes[attributeId]
                        .name
                    )[0]
                  ];
              Object.keys(
                product.variations[variationId].attributes[attributeId].options
              ).forEach((optionId) => {
                attributeOptionNames[optionId] = product.variations[variationId]
                  .attributes[attributeId].options[optionId].name[
                  app.translator.locale
                ]
                  ? product.variations[variationId].attributes[attributeId]
                      .options[optionId].name[app.translator.locale]
                  : product.variations[variationId].attributes[attributeId]
                      .options[optionId].name[
                      Object.keys(
                        product.variations[variationId].attributes[attributeId]
                          .options[optionId].name
                      )[0]
                    ];
              });
            }
          }
        );
      });
    });
    setAttributeName(newAttributeName);
    setAttributeOptionNames(attributeOptionNames);
  }, [props.attributeId, app.translator.locale, app.products.get]);

  if (!isAttributeReady) {
    return null;
  }

  return (
    <div
      className={`attribute-filter ${props.className ? props.className : ''}`}
    >
      <h3 className="p-0 m-0">{attributeName}</h3>
      <div
        className={`${props.containerClassName ? props.containerClassName : ''}`}
      >
        {Object.keys(attributeOptionNames).map((attributeOptionId, index) => (
          <FormField
            key={index}
            form={props.attributeId}
            field={attributeOptionId}
            type="checkbox"
            value={
              props.filters.attributes[props.attributeId].includes(
                attributeOptionId
              )
                ? 'enabled'
                : ''
            }
            setValue={(value) => {
              const selectedAttributeOptionIds: string[] =
                props.filters.attributes[props.attributeId];
              if (value === 'enabled') {
                if (!selectedAttributeOptionIds.includes(attributeOptionId)) {
                  selectedAttributeOptionIds.push(attributeOptionId);
                }
              } else {
                const indexOfExistingAttributeOptionId =
                  selectedAttributeOptionIds.indexOf(attributeOptionId);
                if (indexOfExistingAttributeOptionId > -1) {
                  selectedAttributeOptionIds.splice(
                    indexOfExistingAttributeOptionId,
                    1
                  );
                }
              }
              props.setFilters((filters) => ({
                ...filters,
                attributes: {
                  ...filters.attributes,
                  [props.attributeId]: selectedAttributeOptionIds,
                },
              }));
            }}
            selectOptions={[
              {
                label: attributeOptionNames[attributeOptionId],
                value: 'enabled',
              },
            ]}
          />
        ))}
      </div>
    </div>
  );
};

export default AttributeFilter;
