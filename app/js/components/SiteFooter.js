import React from 'react';
import {
  Container,
} from 'amazeui-react';
import { myConfig } from '../components/config.js';

const year = new Date().getFullYear();

const SiteFooter = function SiteFooter() {
  return (
    <footer className="ask-footer">
      <Container>
        <p>© {year}{myConfig.footer}</p>
      </Container>
    </footer>
  );
};

export default SiteFooter;
