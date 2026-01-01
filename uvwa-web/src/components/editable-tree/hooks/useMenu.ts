import React, { useCallback, useState } from 'react';

interface MenuState {
  open: boolean;
  position: { x: number; y: number };
  nodeId?: React.Key;
}

export function useMenu() {
  const [menu, setMenu] = useState<MenuState>({
    open: false,
    position: { x: 0, y: 0 },
  });

  const showMenu = useCallback((info: { event: React.MouseEvent; node: any }) => {
    info.event.preventDefault();
    setMenu({ open: true, position: { x: info.event.clientX, y: info.event.clientY }, nodeId: info.node.key });
  }, []);

  const hideMenu = useCallback(() => {
    setMenu({ open: false, position: { x: 0, y: 0 } });
  }, []);

  return { menu, showMenu, hideMenu };
}
