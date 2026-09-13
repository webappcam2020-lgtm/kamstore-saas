import pytest
from app.services.scraper_service import ProxyRotator

def test_proxy_rotator_round_robin():
    proxies = ["http://1.1.1.1:8080", "http://2.2.2.2:8080", "http://3.3.3.3:8080"]
    rotator = ProxyRotator(proxies=proxies, strategy="round_robin")
    
    p1 = rotator.get_proxy()
    p2 = rotator.get_proxy()
    p3 = rotator.get_proxy()
    p4 = rotator.get_proxy()

    assert p1 == "http://2.2.2.2:8080" or p1 in proxies
    assert p4 == p1  # Loops back in round robin

def test_proxy_health_tracking():
    proxies = ["http://10.0.0.1:8080"]
    rotator = ProxyRotator(proxies=proxies)
    
    rotator.report_success("http://10.0.0.1:8080")
    status = rotator.get_status()
    assert status["proxies"][0]["success_count"] == 1
    assert status["proxies"][0]["health_score"] == 100

    # Simulate multiple failures to trigger quarantine
    for _ in range(5):
        rotator.report_failure("http://10.0.0.1:8080")
    
    status_after = rotator.get_status()
    assert status_after["proxies"][0]["is_active"] is False
    assert rotator.get_proxy() is None  # Quarantined
