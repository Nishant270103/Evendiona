// src/components/ui/PageTransition.jsx
import { useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

export default function PageTransition({ children, location }) {
  const nodeRef = useRef(null);

  return (
    <CSSTransition
      key={location?.pathname || 'default'}
      nodeRef={nodeRef} // ✅ ADD THIS
      in={true}
      timeout={300}
      classNames="page-transition"
      unmountOnExit
    >
      <div ref={nodeRef}> {/* ✅ ADD REF TO WRAPPER */}
        {children}
      </div>
    </CSSTransition>
  );
}
