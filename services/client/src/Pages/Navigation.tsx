import React, { ReactNode } from "react";

interface NavigationProps {
  children: ReactNode;
}

interface LinkItemProps {
  href: string;
  text: string;
}

export const Navigation: React.FC<NavigationProps> = ({ children }) => {

  return (
    <>
      <nav className="py-4 border-b">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex justify-between items-center">
            <ul className="flex space-x-6">
              <LinkItem href="/" text="Home" />
            </ul>
            <button>
              <a href="/login" className="hover:text-gray-300">
                Login
              </a>
            </button>
          </div>
        </div>
      </nav>

      <main>{children}</main>

      {/* footer */}
        <footer className="py-4 border-t">
            <Footer />
        </footer>

    </>
  );
};

const LinkItem: React.FC<LinkItemProps> = ({ href, text }) => {
  return (
    <li>
      <a href={href} className="hover:text-gray-300">
        {text}
      </a>
    </li>
  );
};

const Footer = () => {
    return (
        <div className="mx-auto max-w-7xl px-4">
            <div className="flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} My Company</p>
            <ul className="flex space-x-6">
                <LinkItem href="/privacy" text="Privacy" />
                <LinkItem href="/terms" text="Terms" />
            </ul>
            </div>
            <p className="text-sm text-gray-500">
            This website is for demonstration purposes only.
            </p>
        </div>
    );
}
