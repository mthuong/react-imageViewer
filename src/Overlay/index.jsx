import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import './style.css';

let originalBodyOverflow = null;

function preventDefault(e) {
  e.preventDefault();
}
export default class Overlay extends PureComponent {
  static propTypes = {
    parentSelector: PropTypes.func,
  };

  static defaultProps = {
    parentSelector() {
      return document.body;
    },
  };

  node = document.createElement('div');

  componentDidMount() {
    Overlay.preventScrolling();
    const parent = this.props.parentSelector();
    parent.appendChild(this.node);
  }

  componentWillReceiveProps(newProps) {
    const currentParent = this.props.parentSelector();
    const newParent = newProps.parentSelector();

    if (newParent !== currentParent) {
      currentParent.removeChild(this.node);
      newParent.appendChild(this.node);
    }
  }

  componentWillUnmount() {
    if (this.layer) {
      this.layer.removeEventListener('touchstart', preventDefault);
    }
    const parent = this.props.parentSelector();
    if (!this.node) return;
    parent.removeChild(this.node);
    Overlay.allowScrolling();
  }

  getLayer = el => {
    if (el) {
      this.layer = el;
      el.addEventListener('touchstart', preventDefault);
    }
  }

  static preventScrolling() {
    const { body } = document;
    originalBodyOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
  }

  static allowScrolling() {
    const { body } = document;
    body.style.overflow = originalBodyOverflow || '';
    originalBodyOverflow = null;
  }

  render() {
    return ReactDOM.createPortal(
      <div className="image-slides-overlay" ref={this.getLayer} >
        {this.props.children}
      </div>,
      this.node,
    );
  }
}
