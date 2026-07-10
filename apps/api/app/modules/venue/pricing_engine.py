from collections.abc import Sequence
from dataclasses import dataclass
from datetime import date, time
from decimal import ROUND_HALF_EVEN, Decimal
from uuid import UUID

from app.modules.venue.models import VenuePricingRule


def _banker_round(value: Decimal) -> int:
    """Banker's rounding to nearest integer for financial precision."""
    return int(value.quantize(Decimal("1"), rounding=ROUND_HALF_EVEN))


@dataclass
class PricedUnit:
    base_paise: int
    final_paise: int
    applied_rule_id: UUID | None
    applied_rule_name: str | None
    clamped: bool


def _rule_matches_date(rule: VenuePricingRule, target_date: date) -> bool:
    if rule.days_of_week is not None and target_date.weekday() not in rule.days_of_week:
        return False
    if rule.start_date is not None and target_date < rule.start_date:
        return False
    if rule.end_date is not None and target_date > rule.end_date:
        return False
    return True


def _rule_matches_time(rule: VenuePricingRule, target_time: time | None) -> bool:
    if rule.start_time is None and rule.end_time is None:
        return True
    if target_time is None:
        return False
    if rule.start_time is not None and target_time < rule.start_time:
        return False
    if rule.end_time is not None and target_time >= rule.end_time:
        return False
    return True


def resolve_rule(
    rules: Sequence[VenuePricingRule],
    *,
    target_date: date,
    target_time: time | None,
    applies_to: str,
) -> VenuePricingRule | None:
    """Highest-priority active rule matching the given date/time. No stacking."""
    candidates = [
        r for r in rules
        if r.is_active
        and r.deleted_at is None
        and r.applies_to in (applies_to, "both")
        and _rule_matches_date(r, target_date)
        and _rule_matches_time(r, target_time)
    ]
    if not candidates:
        return None
    candidates.sort(key=lambda r: (r.priority, r.created_at), reverse=True)
    return candidates[0]


def apply_adjustment(base_paise: int, rule: VenuePricingRule | None) -> int:
    if rule is None:
        return base_paise
    if rule.adjustment_type == "multiplier":
        return _banker_round(Decimal(str(base_paise)) * Decimal(str(rule.multiplier)))
    if rule.adjustment_type == "fixed_delta":
        return max(0, base_paise + rule.amount_paise)
    if rule.adjustment_type == "override":
        return rule.amount_paise
    return base_paise


def clamp_price(
    computed_paise: int,
    base_paise: int,
    min_price_pct: Decimal,
    max_price_pct: Decimal,
) -> tuple[int, bool]:
    floor_paise = _banker_round(Decimal(str(base_paise)) * min_price_pct / Decimal("100"))
    ceiling_paise = _banker_round(Decimal(str(base_paise)) * max_price_pct / Decimal("100"))
    if computed_paise < floor_paise:
        return floor_paise, True
    if computed_paise > ceiling_paise:
        return ceiling_paise, True
    return computed_paise, False


def price_unit(
    rules: Sequence[VenuePricingRule],
    *,
    base_paise: int,
    target_date: date,
    target_time: time | None,
    applies_to: str,
    min_price_pct: Decimal,
    max_price_pct: Decimal,
) -> PricedUnit:
    rule = resolve_rule(rules, target_date=target_date, target_time=target_time, applies_to=applies_to)
    computed_paise = apply_adjustment(base_paise, rule)
    final_paise, clamped = clamp_price(computed_paise, base_paise, min_price_pct, max_price_pct)
    return PricedUnit(
        base_paise=base_paise,
        final_paise=final_paise,
        applied_rule_id=rule.id if rule else None,
        applied_rule_name=rule.name if rule else None,
        clamped=clamped,
    )
