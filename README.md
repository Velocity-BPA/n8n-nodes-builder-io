# n8n-nodes-builder-io

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for Builder.io, the visual CMS and headless content platform. This node enables marketing teams and developers to automate content management, publishing workflows, and cross-platform content distribution through n8n workflows.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Builder.io](https://img.shields.io/badge/Builder.io-Visual_CMS-18B4F4)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6)

## Features

- **Complete Content Management**: Full CRUD operations for content entries with MongoDB-style querying
- **Visual Publishing Workflows**: Publish, unpublish, archive, and duplicate content programmatically
- **Asset Management**: Upload, organize, and manage media assets with folder support
- **Symbols & Reusable Blocks**: Manage reusable content components across your site
- **A/B Testing & Analytics**: Retrieve test results, impressions, and conversion data
- **Multi-Locale Support**: Full localization features for international content
- **Targeting & Personalization**: Create custom targeting attributes and evaluate rules
- **Webhook Triggers**: Real-time content change notifications with signature verification
- **Multi-Space Support**: Manage multiple Builder.io spaces from one node

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter: `n8n-nodes-builder-io`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n custom nodes directory
cd ~/.n8n/custom

# Clone or copy the node package
npm install n8n-nodes-builder-io

# Restart n8n
n8n start
```

### Development Installation

```bash
# 1. Extract the zip file
unzip n8n-nodes-builder-io.zip
cd n8n-nodes-builder-io

# 2. Install dependencies
npm install

# 3. Build the project
npm run build

# 4. Create symlink to n8n custom nodes directory
# For Linux/macOS:
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-builder-io

# For Windows (run as Administrator):
# mklink /D %USERPROFILE%\.n8n\custom\n8n-nodes-builder-io %CD%

# 5. Restart n8n
n8n start
```

## Credentials Setup

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `publicApiKey` | String | Yes | Public API key for reading content (safe for client-side use) |
| `privateApiKey` | String | No | Private API key for write operations and admin actions |
| `spaceId` | String | No | Space ID for multi-space organizations |

### Obtaining API Keys

1. Log in to [Builder.io dashboard](https://builder.io)
2. Navigate to **Account Settings** (gear icon)
3. Find **Public API Key** for read operations
4. Generate a **Private API Key** under "Private keys" section for write operations

## Resources & Operations

### Content

Manage content entries across all your Builder.io models.

| Operation | Description |
|-----------|-------------|
| `get` | Get a single content entry by ID |
| `getAll` | Get all content entries for a model |
| `getByUrl` | Get content entry matching a URL path |
| `query` | Query content with MongoDB-style filters |
| `create` | Create a new content entry |
| `update` | Update an existing content entry |
| `patch` | Partially update a content entry |
| `delete` | Delete a content entry |
| `publish` | Publish a draft content entry |
| `unpublish` | Unpublish a content entry |
| `archive` | Archive a content entry |
| `duplicate` | Duplicate a content entry |

### Model

Introspect content models and schemas.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all models in the space |
| `get` | Get a specific model by name or ID |
| `getSchema` | Get the field schema for a model |
| `getEntries` | Get all entries for a specific model |
| `count` | Count entries in a model |

### Asset

Upload and manage media assets.

| Operation | Description |
|-----------|-------------|
| `upload` | Upload a new asset (image, video, file) |
| `getAll` | List all assets |
| `get` | Get asset by ID |
| `delete` | Delete an asset |
| `getByUrl` | Get asset metadata by URL |
| `createFolder` | Create an asset folder |
| `move` | Move asset to a folder |

### Symbol

Manage reusable content blocks.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all symbols |
| `get` | Get a symbol by ID or name |
| `create` | Create a new symbol |
| `update` | Update a symbol |
| `delete` | Delete a symbol |
| `getInstances` | Get all content using a symbol |

### User

Manage users and permissions.

| Operation | Description |
|-----------|-------------|
| `getCurrent` | Get current authenticated user |
| `getAll` | List all users in the organization |
| `get` | Get user by ID |
| `invite` | Invite a new user |
| `updateRole` | Update user's role/permissions |
| `remove` | Remove user from organization |

### Space

Manage Builder.io spaces.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all spaces in the organization |
| `get` | Get space details |
| `create` | Create a new space |
| `update` | Update space settings |
| `delete` | Delete a space |
| `getApiKeys` | Get API keys for a space |

### Targeting

Manage custom targeting attributes for personalization.

| Operation | Description |
|-----------|-------------|
| `getAttributes` | Get custom targeting attributes |
| `createAttribute` | Create a custom targeting attribute |
| `updateAttribute` | Update a targeting attribute |
| `deleteAttribute` | Delete a targeting attribute |
| `evaluate` | Evaluate targeting rules for content |

### Webhook

Manage webhooks for content change notifications.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all webhooks |
| `get` | Get webhook by ID |
| `create` | Create a new webhook |
| `update` | Update a webhook |
| `delete` | Delete a webhook |
| `test` | Send test webhook payload |

### Locale

Manage localization settings.

| Operation | Description |
|-----------|-------------|
| `getAll` | List all configured locales |
| `get` | Get locale details |
| `create` | Create a new locale |
| `update` | Update locale settings |
| `delete` | Delete a locale |
| `setDefault` | Set default locale |

### Analytics

Retrieve content performance data.

| Operation | Description |
|-----------|-------------|
| `getImpressions` | Get content impression data |
| `getConversions` | Get conversion tracking data |
| `getABTestResults` | Get A/B test performance data |
| `getContentInsights` | Get content entry insights |

## Trigger Node

The **Builder.io Trigger** node receives real-time webhook notifications when content changes occur.

### Supported Events

| Event | Description |
|-------|-------------|
| `content.published` | Content entry published |
| `content.unpublished` | Content entry unpublished |
| `content.updated` | Content entry updated |
| `content.deleted` | Content entry deleted |
| `content.archived` | Content entry archived |
| `asset.uploaded` | New asset uploaded |
| `asset.deleted` | Asset deleted |

### Webhook Verification

The trigger node supports HMAC SHA-256 signature verification via the `x-builder-signature` header when a webhook secret is configured.

## Usage Examples

### Query Published Content

```javascript
// Node configuration
Resource: Content
Operation: Query
Model: blog-post
Published Status: published
Query Filters: [
  { field: "data.category", operator: "equals", value: "technology" }
]
Limit: 10
```

### Create and Publish Content

```javascript
// Create content entry
Resource: Content
Operation: Create
Model: page
Name: About Us Page
Data: {
  "title": "About Us",
  "slug": "about",
  "content": "Welcome to our company..."
}

// Then publish it
Resource: Content
Operation: Publish
Entry ID: {{ $json.id }}
```

### Upload an Asset

```javascript
// Node configuration
Resource: Asset
Operation: Upload
Binary Property: data
Filename: hero-image.jpg
Folder: /images/heroes
```

### Evaluate Targeting

```javascript
// Node configuration
Resource: Targeting
Operation: Evaluate
Content ID: abc123
User Attributes: [
  { name: "country", value: "US", type: "string" },
  { name: "loggedIn", value: "true", type: "boolean" }
]
```

## Builder.io Concepts

### Models

Models define the structure of your content. Common models include:
- **page**: Full page content with URL routing
- **section**: Reusable sections that can be embedded in pages
- **data**: Structured data without visual representation

### Content Entries

Each piece of content is an "entry" belonging to a model. Entries have:
- `id`: Unique identifier
- `name`: Display name
- `data`: The actual content fields
- `query`: Targeting rules (URL, user attributes, etc.)
- `published`: Status (draft, published, archived)

### Targeting

Builder.io supports personalization through targeting rules:
- URL-based targeting (show content on specific pages)
- User attribute targeting (show content to specific user segments)
- A/B testing (show variations to different percentages of users)

### Symbols

Symbols are reusable content blocks that can be embedded in multiple pages. When you update a symbol, all instances update automatically.

## Error Handling

The node provides detailed error messages for common scenarios:

| Error Code | Description | Solution |
|------------|-------------|----------|
| 401 | Invalid or missing API key | Verify your API credentials |
| 403 | Insufficient permissions | Use private API key for write operations |
| 404 | Model or entry not found | Check model name and entry ID |
| 409 | Version conflict | Fetch latest version before updating |
| 429 | Rate limit exceeded | Implement delays between requests |

## Security Best Practices

1. **Never expose private API keys** in client-side code or public repositories
2. **Use webhook secrets** to verify incoming webhook payloads
3. **Limit API key permissions** when possible
4. **Rotate API keys** periodically
5. **Use environment variables** for storing credentials in n8n

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run linting
npm run lint

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Watch mode for development
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please ensure your code follows the existing style and includes tests.

## Support

- **Documentation**: [Builder.io Docs](https://www.builder.io/c/docs/intro)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-builder-io/issues)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Builder.io](https://builder.io) for their excellent visual CMS platform and API
- [n8n](https://n8n.io) for the powerful workflow automation platform
- The n8n community for inspiration and support
