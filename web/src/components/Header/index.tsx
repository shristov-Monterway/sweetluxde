import React from 'react';
import { AbstractComponentType } from '../../types/AbstractComponentType';
import ThemeToggle from '../ThemeToggle';
import LocaleModalToggle from '../LocaleModalToggle';
import useApp from '../../hooks/useApp';
import AuthModalToggle from '../AuthModalToggle';
import Link from 'next/link';

export interface HeaderProps extends AbstractComponentType {
  hasShadow?: boolean;
}

const Header = (props: HeaderProps): React.JSX.Element => {
  const app = useApp();

  return (
    <nav
      className={`navbar navbar-expand-xl ${props.hasShadow ? 'shadow-lg' : ''} ${props.className ? props.className : ''}`}
    >
      <div className="container">
        <Link href="/" passHref={true}>
          <a className="navbar-brand">Navbar</a>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="navbar-collapse collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto">
            <li className="nav-item active">
              <a className="nav-link" href="#!">
                Home <span className="visually-hidden">(current)</span>
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#!">
                Link
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" href="#!">
                Disabled
              </a>
            </li>
            <li className="nav-item">
              <div className="nav-link d-flex gap-1">
                <ThemeToggle className="btn btn-primary btn-sm" />
                <LocaleModalToggle className="btn btn-primary btn-sm" />
                {app.user ? (
                  <>
                    <Link href="/account" passHref={true}>
                      <a className="btn btn-primary btn-sm">
                        <i className="fe fe-user" />
                      </a>
                    </Link>
                    <Link href="/cart" passHref={true}>
                      <a className="btn btn-primary btn-sm position-relative">
                        <i className="fe fe-shopping-cart" />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-2">
                          {app.user.cart.lineItems
                            .map((lineItem) => lineItem.quantity)
                            .reduce((sum, quantity) => sum + quantity, 0)}
                        </span>
                      </a>
                    </Link>
                    <Link href="/wishlist" passHref={true}>
                      <a className="btn btn-primary btn-sm position-relative">
                        <i className="fe fe-bookmark" />
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger z-2">
                          {app.user.wishlist.lineItems
                            .map((lineItem) => lineItem.quantity)
                            .reduce((sum, quantity) => sum + quantity, 0)}
                        </span>
                      </a>
                    </Link>
                  </>
                ) : (
                  <AuthModalToggle className="btn btn-primary btn-sm" />
                )}
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
