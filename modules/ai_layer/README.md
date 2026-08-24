# ai_layer

Natural-language question to query translation (Text-to-SQL) via an LLM (e.g.
Claude / Anthropic API). Reads schema + system prompt from config, queries
`data_layer`, and fills the result into a `templates/*.schema.json` template —
never invents its own chart format.

Status: not yet implemented.
