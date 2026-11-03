
import re
import ipaddress
from urllib.parse import urlparse


def features_extract(url):
    url = str(url).strip()

    if not url:
        raise ValueError("URL cannot be empty")

    parsed_url = urlparse(
        url if "://" in url else "https://" + url
    )

    hostname = parsed_url.hostname or ""

    url_length = len(url)
    domain_length = len(hostname)

    # Check whether hostname is a valid IP address
    try:
        ipaddress.ip_address(hostname)
        is_domain_ip = 1
    except ValueError:
        is_domain_ip = 0

    no_of_letters = sum(c.isalpha() for c in url)
    no_of_digits = sum(c.isdigit() for c in url)

    no_of_other_special_chars = sum(
        not c.isalnum() and c not in "/-.:?=&_%#"
        for c in url
    )

    special_char_ratio = (
        sum(not c.isalnum() for c in url) /
        max(url_length, 1)
    )

    digit_ratio = no_of_digits / max(url_length, 1)
    letter_ratio = no_of_letters / max(url_length, 1)

    # Subdomain calculation
    subdomain_parts = hostname.split(".") if hostname else []

    no_of_subdomain = max(
        len(subdomain_parts) - 2, 0
    )

    # TLD calculation
    tld = (
        subdomain_parts[-1]
        if len(subdomain_parts) > 1
        else ""
    )

    tld_length = len(tld)

    is_https = int(parsed_url.scheme.lower() == "https")

    return {
        "IsDomainIP": is_domain_ip,
        "NoOfLettersInURL": no_of_letters,
        "NoOfDegitsInURL": no_of_digits,
        "NoOfOtherSpecialCharsInURL": no_of_other_special_chars,
        "SpacialCharRatioInURL": special_char_ratio,
        "DegitRatioInURL": digit_ratio,
        "LetterRatioInURL": letter_ratio,
        "NoOfSubDomain": no_of_subdomain,
        "TLDLength": tld_length,
        "IsHTTPS": is_https
    }
