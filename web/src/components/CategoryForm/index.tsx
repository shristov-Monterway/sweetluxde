import React from 'react';
import { CategoryType } from '../../../../types/internal/CategoryType';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import TranslationFormField from '../TranslationFormField';
import FormField from '../FormField';
import FirebaseFunctionsModule from '../../modules/FirebaseFunctionsModule';
import { CategoryCreateUpdateRequestType } from '../../../../types/api/admin/CategoryCreateUpdateRequestType';
import { CategoryCreateUpdateResponseType } from '../../../../types/api/admin/CategoryCreateUpdateResponseType';
import Expandable, { ExpandableElementType } from '../Expandable';
import { CategoryDeleteRequestType } from '../../../../types/api/admin/CategoryDeleteRequestType';
import { CategoryDeleteResponseType } from '../../../../types/api/admin/CategoryDeleteResponseType';
import { useRouter } from 'next/router';

export interface CategoryFormProps extends AbstractComponentType {
  category?: CategoryType;
  onSuccess?: (category: CategoryType) => void;
  onFailure?: (error: Error) => void;
}

const CategoryForm = (props: CategoryFormProps): React.JSX.Element => {
  const id = 'category';
  const app = useApp();
  const router = useRouter();
  const uid = props.category ? props.category.uid : undefined;
  const category: Omit<CategoryType, 'uid'> = props.category
    ? (() => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uid, ...category } = props.category;
        return category;
      })()
    : {
        name: {},
        description: {},
        parentUid: null,
      };
  const [newCategory, setNewCategory] =
    React.useState<Omit<CategoryType, 'uid'>>(category);
  const [parentUidStatus, setParentUidStatus] = React.useState<'enabled' | ''>(
    newCategory.parentUid ? 'enabled' : ''
  );
  const [parentUid, setParentUid] = React.useState<string>('');
  const [categoryFieldExpandableId, setCategoryFieldExpandableId] =
    React.useState<string | undefined>(undefined);
  const [categoryNames, setCategoryNames] = React.useState<{
    [categoryId: string]: string;
  }>(
    app.categories.get
      .filter((category) => {
        if (uid) return category.uid !== uid;
        return true;
      })
      .reduce(
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
      app.categories.get
        .filter((category) => {
          if (uid) return category.uid !== uid;
          return true;
        })
        .reduce(
          (categoryNames, category) => ({
            ...categoryNames,
            [category.uid]: category.name[app.translator.locale]
              ? category.name[app.translator.locale]
              : category.name[Object.keys(category.name)[0]],
          }),
          {}
        )
    );
  }, [app.categories.get, uid, app.translator.locale]);

  React.useEffect(() => {
    if (parentUidStatus === 'enabled') {
      setNewCategory((newCategory) => ({
        ...newCategory,
        parentUid,
      }));
    } else {
      setNewCategory((newCategory) => ({
        ...newCategory,
        parentUid: null,
      }));
    }
  }, [parentUidStatus, parentUid]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    FirebaseFunctionsModule<
      CategoryCreateUpdateRequestType,
      CategoryCreateUpdateResponseType
    >()
      .call(
        '/admin/category/createUpdate',
        {
          category: newCategory,
          uid,
        },
        app.translator.locale,
        app.currency.get
      )
      .then((response) => {
        if (props.onSuccess) {
          props.onSuccess(response.category);
        }
      })
      .catch(() => {
        if (props.onFailure) {
          props.onFailure(new Error('Error managing category.'));
        }
      });
  };

  const onDelete = async (): Promise<void> => {
    if (!uid) {
      return;
    }

    await FirebaseFunctionsModule<
      CategoryDeleteRequestType,
      CategoryDeleteResponseType
    >().call(
      '/admin/category/delete',
      {
        uid,
      },
      app.translator.locale,
      app.currency.get
    );

    app.categories.refresh().then(() => {
      router.push('/admin');
    });
  };

  const optionalExpandables: ExpandableElementType[] = [];

  if (uid) {
    optionalExpandables.push({
      id: 'actions',
      label: app.translator.t('components.categoryForm.actions'),
      children: (
        <button
          className="btn btn-danger d-flex gap-3 justify-content-center align-items-center"
          onClick={onDelete}
          type="button"
        >
          <i className="fe fe-trash" />{' '}
          {app.translator.t('components.categoryForm.deleteAction')}
        </button>
      ),
    });
  }

  return (
    <form
      className={`form product-form ${props.className ? props.className : ''}`}
      onSubmit={onSubmit}
    >
      <Expandable
        value={categoryFieldExpandableId}
        setValue={(value) => setCategoryFieldExpandableId(value)}
        elements={[
          {
            id: 'name',
            label: app.translator.t('components.categoryForm.name'),
            children: (
              <TranslationFormField
                form="category"
                field="name"
                translations={newCategory.name}
                setTranslations={(translations) => {
                  setNewCategory((newCategory) => ({
                    ...newCategory,
                    name: translations,
                  }));
                }}
              />
            ),
          },
          {
            id: 'description',
            label: app.translator.t('components.categoryForm.description'),
            children: (
              <TranslationFormField
                form="category"
                field="description"
                translations={newCategory.description}
                setTranslations={(translations) => {
                  setNewCategory((newCategory) => ({
                    ...newCategory,
                    description: translations,
                  }));
                }}
              />
            ),
          },
          {
            id: 'parentUid',
            label: app.translator.t('components.categoryForm.parentUid'),
            children: (
              <div className="d-flex flex-column gap-3">
                <FormField
                  form="product"
                  field="parentUidStatus"
                  type="checkbox"
                  value={parentUidStatus}
                  setValue={(value) =>
                    setParentUidStatus(value as 'enabled' | '')
                  }
                  selectOptions={[
                    {
                      label: app.translator.t(
                        'form.category.parentUidStatus.option.enabled.label'
                      ),
                      value: 'enabled',
                      help: app.translator.t(
                        'form.category.parentUidStatus.option.enabled.help'
                      ),
                    },
                  ]}
                />
                {parentUidStatus === 'enabled' ? (
                  <FormField
                    form="category"
                    field="parentUid"
                    type="select"
                    value={parentUid}
                    setValue={(value) => setParentUid(value)}
                    selectOptions={Object.keys(categoryNames).map(
                      (categoryId) => ({
                        label: categoryNames[categoryId],
                        value: categoryId,
                      })
                    )}
                  />
                ) : null}
              </div>
            ),
          },
          ...optionalExpandables,
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

export default CategoryForm;
