import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import ThemeToggle from '../ThemeToggle';
import LocaleModalToggle from '../LocaleModalToggle';
import useApp from '../../hooks/useApp';
import AuthModalToggle from '../AuthModalToggle';
import Link from 'next/link';
import CurrencyModalToggle from '../CurrencyModalToggle';
import NavModalToggle from '../NavModalToggle';
import { UserType } from '../../../../types/internal/UserType';

export interface HeaderProps extends AbstractComponentType {
  container?: 'container' | 'container-fluid';
}

const Header = (props: HeaderProps): React.JSX.Element => {
  const app = useApp();
  const container =
    typeof props.container !== 'undefined' ? props.container : 'container';

  const getUserNav = (
    user: UserType | null,
    isMobile: boolean
  ): React.JSX.Element[] => {
    const userNav: React.JSX.Element[] = [];
    const buttonClasses = `btn btn-primary ${!isMobile ? 'btn-sm' : ''}`;

    if (user) {
      userNav.push(
        <li className="header__nav-actions-item">
          <Link href="/cart" passHref={true}>
            <a className={`${buttonClasses} position-relative`}>
              <i className="fe fe-shopping-cart" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-2">
                {user.cart.lineItems
                  .map((lineItem) => lineItem.quantity)
                  .reduce((sum, quantity) => sum + quantity, 0)}
              </span>
            </a>
          </Link>
        </li>
      );
      userNav.push(
        <li className="header__nav-actions-item">
          <Link href="/wishlist" passHref={true}>
            <a className={`${buttonClasses} position-relative`}>
              <i className="fe fe-bookmark" />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-2">
                {user.wishlist.lineItems
                  .map((lineItem) => lineItem.quantity)
                  .reduce((sum, quantity) => sum + quantity, 0)}
              </span>
            </a>
          </Link>
        </li>
      );
    } else {
      userNav.push(
        <li className="header__nav-actions-item">
          <AuthModalToggle className={buttonClasses} />
        </li>
      );
    }

    return userNav;
  };

  return (
    <div className={`header ${props.className || ''}`}>
      <div className={`${container}`}>
        <div
          className="header__container"
          style={{
            height: app.config.headerHeight,
          }}
        >
          <Link href="/" passHref={true}>
            <a className="header__brand">Navbar</a>
          </Link>
          <ul className="header__nav-actions header__nav-actions--mobile">
            {getUserNav(app.user, true)}
            <li className="header__nav-actions-item">
              <NavModalToggle className="btn btn-primary" />
            </li>
          </ul>
          <div className="header__main-nav">
            <ul className="header__nav">
              <li className="header__nav-item">
                <Link href="/" passHref={true}>
                  <a className="header__nav-link">
                    <i className="fe fe-home" />
                    <span>{app.translator.t('pages./.title')}</span>
                  </a>
                </Link>
              </li>
            </ul>
            <ul className="header__nav-actions">
              <li className="header__nav-actions-item">
                <ThemeToggle className="btn btn-primary btn-sm" />
              </li>
              <li className="header__nav-actions-item">
                <LocaleModalToggle className="btn btn-primary btn-sm" />
              </li>
              <li className="header__nav-actions-item">
                <CurrencyModalToggle className="btn btn-primary btn-sm" />
              </li>
              {getUserNav(app.user, false)}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
