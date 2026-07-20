"""Purpose: Provide compact task prompt rendering shared by OpenAI-backed agents."""

from string import Template


def render_task_prompt(template: str, **values: str) -> str:
    """Render a task prompt while keeping missing values explicit."""
    safe_values = {key: value or "not provided" for key, value in values.items()}
    return Template(template.strip()).safe_substitute(safe_values)
