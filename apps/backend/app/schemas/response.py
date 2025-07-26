# app/schemas/response.py
from typing import Generic, TypeVar, Optional
from pydantic import BaseModel
from pydantic.generics import GenericModel

T = TypeVar("T")

class SuccessResponse(GenericModel, Generic[T]):
    code: int = 200
    message: str = "Success"
    data: Optional[T] = None
