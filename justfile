
# List available commands
default:
    @just --list

lint:
    npm run lint -- --fix
    
# Start 
run:
    npm run dev

# Deploy with an optional commit message
deploy message="Update":
    ./dev/deploy.sh "{{message}}"