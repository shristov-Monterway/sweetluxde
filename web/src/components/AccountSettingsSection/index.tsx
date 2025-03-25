import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import useApp from '../../hooks/useApp';
import ThemeToggle from '../ThemeToggle';
import LocaleModalToggle from '../LocaleModalToggle';
import CurrencyModalToggle from '../CurrencyModalToggle';

export type AccountSettingsSectionProps = AbstractComponentType;

const AccountSettingsSection = (
  props: AccountSettingsSectionProps
): React.JSX.Element => {
  const app = useApp();

  return (
    <div
      className={`account-settings-section card ${props.className ? props.className : ''}`}
    >
      <div className="card-body d-flex flex-column gap-3">
        <h3 className="m-0 p-0">
          {app.translator.t('components.accountSettingsSection.title')}
        </h3>
        <div className="account-settings-section__actions">
          <ThemeToggle
            className="btn btn-primary"
            label={
              <div className="d-flex justify-content-center align-items-center gap-2">
                <i
                  className={`fe fe-${app.theme.get === 'light' ? 'moon' : 'sun'}`}
                />
                {app.translator.t(
                  'components.accountSettingsSection.changeTheme'
                )}
              </div>
            }
          />
          <LocaleModalToggle
            className="btn btn-primary"
            label={
              <div className="d-flex justify-content-center align-items-center gap-2">
                <i className="fe fe-globe" />
                {app.translator.t(
                  'components.accountSettingsSection.chooseLanguage'
                )}
              </div>
            }
          />
          <CurrencyModalToggle
            className="btn btn-primary"
            label={
              <div className="d-flex justify-content-center align-items-center gap-2">
                <i className="fe fe-dollar-sign" />
                {app.translator.t(
                  'components.accountSettingsSection.chooseCurrency'
                )}
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default AccountSettingsSection;
