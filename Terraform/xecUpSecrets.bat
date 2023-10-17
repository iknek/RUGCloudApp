# Path to the JSON file
$jsonFilePath = "/secrets.auto.tfvars.json"

# Read the JSON content and parse it
$jsonContent = Get-Content -Path $jsonFilePath | ConvertFrom-Json

# Extract the token from the JSON object
$token = $jsonContent.token

# Path to the YAML file
$yamlFilePath = "/flatcar_workerOne.yaml"

# Read the content of the YAML file
$content = Get-Content -Path $yamlFilePath

# Replace the placeholder with the token
$newContent = $content -replace "tokenA", $tokenA

# Write the new content back to the YAML file
Set-Content -Path $yamlFilePath -Value $newContent

# Path to the YAML file
$yamlFilePath = "/flatcar_config.yaml"

# Read the content of the YAML file
$content = Get-Content -Path $yamlFilePath

# Replace the placeholder with the token
$newContent = $content -replace "tokenA", $tokenA

# Write the new content back to the YAML file
Set-Content -Path $yamlFilePath -Value $newContent