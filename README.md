# n8n-nodes-builder-io

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Builder.io, the visual headless CMS platform. This node provides access to 5 core resources (Content, Models, Assets, Webhooks, Analytics) enabling developers to automate content management, publish workflows, and build dynamic digital experiences.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Headless CMS](https://img.shields.io/badge/Builder.io-Visual%20CMS-orange)
![Visual Builder](https://img.shields.io/badge/Visual-Builder-green)
![Content API](https://img.shields.io/badge/Content-API-purple)

## Features

- **Visual Content Management** - Create, read, update and delete visual content entries with Builder.io's drag-and-drop editor
- **Model Configuration** - Define and manage content models, fields, and validation rules programmatically
- **Asset Management** - Upload, organize, and optimize images, videos, and other digital assets
- **Webhook Integration** - Set up real-time notifications for content changes, publishing events, and user interactions
- **Analytics Insights** - Access content performance data, A/B testing results, and engagement metrics
- **Multi-space Support** - Work across different Builder.io spaces and environments
- **Visual Editor Integration** - Seamlessly connect n8n workflows with Builder.io's visual editing interface
- **A/B Testing Automation** - Programmatically manage experiments and analyze conversion data

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-builder-io`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-builder-io
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-builder-io.git
cd n8n-nodes-builder-io
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-builder-io
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Builder.io private API key from account settings | Yes |
| Space ID | The Builder.io space identifier for content operations | Yes |
| Environment | Target environment (development, staging, production) | No |

## Resources & Operations

### 1. Content

| Operation | Description |
|-----------|-------------|
| Get | Retrieve content entries by ID, URL, or query parameters |
| Get All | List all content entries with filtering and pagination |
| Create | Create new content entries with visual components |
| Update | Modify existing content entries and their data |
| Delete | Remove content entries from Builder.io |
| Publish | Publish content to live environments |
| Unpublish | Remove content from live environments |

### 2. Models

| Operation | Description |
|-----------|-------------|
| Get | Retrieve model definitions and field configurations |
| Get All | List all content models in the space |
| Create | Create new content models with field schemas |
| Update | Modify model structures and validation rules |
| Delete | Remove content models and their associations |

### 3. Assets

| Operation | Description |
|-----------|-------------|
| Get | Retrieve asset metadata and URLs by ID |
| Get All | List all assets with filtering options |
| Upload | Upload new images, videos, or documents |
| Update | Modify asset metadata and properties |
| Delete | Remove assets from the media library |
| Optimize | Apply image optimization and transformations |

### 4. Webhooks

| Operation | Description |
|-----------|-------------|
| Get | Retrieve webhook configuration by ID |
| Get All | List all configured webhooks |
| Create | Set up new webhook endpoints for events |
| Update | Modify webhook URLs and event triggers |
| Delete | Remove webhook configurations |
| Test | Send test events to webhook endpoints |

### 5. Analytics

| Operation | Description |
|-----------|-------------|
| Get Content Stats | Retrieve performance metrics for content entries |
| Get A/B Test Results | Access experiment data and conversion metrics |
| Get Page Views | Fetch page view analytics and user engagement |
| Get Conversion Data | Retrieve conversion tracking and goal completion |

## Usage Examples

```javascript
// Create a new content entry for a landing page
{
  "resource": "content",
  "operation": "create",
  "model": "page",
  "data": {
    "name": "Product Launch Page",
    "data": {
      "title": "Revolutionary New Product",
      "hero": {
        "@type": "@builder.io/sdk:Element",
        "component": {
          "name": "Hero",
          "options": {
            "title": "Game-Changing Innovation",
            "subtitle": "Transform your workflow today"
          }
        }
      }
    }
  }
}
```

```javascript
// Query published content with filters
{
  "resource": "content",
  "operation": "getAll",
  "model": "blog-post",
  "query": {
    "published": "published",
    "limit": 10,
    "fields": "data.title,data.author,data.publishedDate"
  }
}
```

```javascript
// Upload and optimize an image asset
{
  "resource": "assets",
  "operation": "upload",
  "file": "data:image/jpeg;base64,/9j/4AAQSkZJRg...",
  "fileName": "hero-image.jpg",
  "options": {
    "resize": { "width": 1920, "height": 1080 },
    "format": "webp",
    "quality": 85
  }
}
```

```javascript
// Set up webhook for content publishing events
{
  "resource": "webhooks",
  "operation": "create",
  "url": "https://myapp.com/webhook/builder-content",
  "events": ["content.published", "content.updated"],
  "model": "page"
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| 401 Unauthorized | Invalid or missing API key | Verify API key in credentials configuration |
| 403 Forbidden | Insufficient permissions for space | Check API key permissions and space access |
| 404 Not Found | Content, model, or asset doesn't exist | Verify resource ID and space configuration |
| 422 Unprocessable Entity | Invalid data structure or missing required fields | Check model schema and required field validation |
| 429 Rate Limit Exceeded | Too many API requests | Implement delay between requests or use batching |
| 500 Internal Server Error | Builder.io service error | Retry request or check Builder.io status page |

## Development

```bash
npm install
npm run build
npm test
npm run lint
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

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-builder-io/issues)
- **Builder.io API Documentation**: [Builder.io API Reference](https://www.builder.io/c/docs/developers)
- **Builder.io Community**: [Builder.io Forum](https://forum.builder.io/)