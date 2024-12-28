Vagrant.configure("2") do |config|
    # Use Ubuntu 20.04
    config.vm.box = "generic/ubuntu2004"
  
    # Configure the network (optional)
    config.vm.network "forwarded_port", guest: 3000, host: 3000 # Forward port for Next.js
  
    # Provisioning script to install dependencies
    config.vm.provision "shell", inline: <<-SHELL
      # Update package list and install prerequisites
      sudo apt-get update -y
      sudo apt-get install -y curl git
      
      # Install Node.js (using NodeSource)
      curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
      sudo apt-get install -y nodejs
      
      # Clone the GameList repository
      git clone http://github.com/strange500/GameList /home/vagrant/GameList
      
      # Navigate to the cloned directory
      sudo chown -R vagrant:vagrant /home/vagrant/GameList
      cd /home/vagrant/GameList
      
      # Install project dependencies
      npm install --legacy-peer-deps

      npx -y auth secret
      
      # Start the development server (optional)
        SHELL
    config.vm.provision "file", source: ".env.local", destination: "/home/vagrant/GameList/.env.local"

  
    # Optional: Specify the VM provider
    config.vm.provider "libvirt" do |v|
      v.memory = "2048" # Allocate more memory if needed
      v.cpus = 2       # Allocate more CPUs if needed
    end
  end
