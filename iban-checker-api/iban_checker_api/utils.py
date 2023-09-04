from math import ceil

from .constants import MOD

def calculate_check_digits(account_string: str) -> str:
    parts = ceil(len(account_string) / 7)
    remainder = ""
    for i in range(1, parts + 1):
        remainder = str(int(remainder + account_string[(i - 1) * 7 : i * 7]) % MOD)
    return "0" + remainder if int(remainder) < 10 else remainder

def map_country_chars_to_digits(chars: str) -> str:
    return "".join([str(ord(char) - 55) for char in chars])