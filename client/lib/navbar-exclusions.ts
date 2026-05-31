// Define routes/paths where Navbar should NOT be shown
export const NAVBAR_EXCLUDED_PATHS = [
  '/admin',
  '/admin-dashboard',
  '/notifications',
  
];

// Check if current path should exclude navbar
export const shouldHideNavbar = (pathname: string): boolean => {
  return NAVBAR_EXCLUDED_PATHS.some(excludedPath => 
    pathname === excludedPath || pathname.startsWith(`${excludedPath}/`)
  );
};