{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  buildInputs = [
    pkgs.devbox
    pkgs.nodejs_22
    pkgs.pnpm   # If you are using Yarn as your package manager
    pkgs.git    # For version control
    pkgs.vite   # If you're planning to use Vite for development
    pkgs.nodePackages."@tailwindcss/language-server"
    pkgs.mariadb
    pkgs.mysql-client
  ];




  # Optionally, you can also set environment variables or shellCommands here
  shellHook = ''
    echo "Welcome to the Next.js development shell!"
    echo "Starting the development environment..."
    echo "MySQL environment ready. You can connect using: mysql -u your_user -p"
  '';
}
