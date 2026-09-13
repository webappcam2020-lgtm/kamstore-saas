from typing import List, Dict, Any, Optional

class AIRecommender:
    """
    Personalized recommendation engine for Tourism and Housing listings.
    Uses heuristic preference scoring and vector matching concepts.
    """

    def match_listings(
        self,
        listings: List[Dict[str, Any]],
        city: Optional[str] = None,
        category: Optional[str] = None,
        budget_min: Optional[float] = None,
        budget_max: Optional[float] = None,
        preferences: Optional[List[str]] = None
    ) -> List[Dict[str, Any]]:
        scored = []
        prefs = [p.lower() for p in (preferences or [])]

        for item in listings:
            score = 1.0
            item_city = item.get("city", "").lower()
            item_cat = item.get("category", "").lower()
            item_price = float(item.get("price", 0))

            if city and city.lower() in item_city:
                score += 3.0
            if category and category.lower() in item_cat:
                score += 2.0
            
            # Budget scoring
            if budget_max and item_price <= budget_max:
                score += 1.5
                if budget_min and item_price >= budget_min:
                    score += 1.0
            
            # Preference keywords matching in title or description
            text = f"{item.get('title', '')} {item.get('description', '')}".lower()
            for p in prefs:
                if p in text:
                    score += 1.0

            scored.append({
                **item,
                "ai_match_score": round(min(score / 8.0, 1.0), 2)
            })

        scored.sort(key=lambda x: x.get("ai_match_score", 0), reverse=True)
        return scored

ai_recommender = AIRecommender()
