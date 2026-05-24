import logging
import uuid

def notify_petition_threshold(petition_id: uuid.UUID, signature_count: int) -> None:
    logging.info(f"PETITION ALERT: Petition {petition_id} crossed {signature_count} signatures!")
