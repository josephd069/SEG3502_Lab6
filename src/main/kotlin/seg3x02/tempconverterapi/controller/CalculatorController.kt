
package seg3x02.tempconverterapi.controller

import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*
import org.springframework.web.server.ResponseStatusException

@RestController
@RequestMapping("/calculator")
class CalculatorController {

    @GetMapping("/add/{nombre1}/{nombre2}")
    fun add(
        @PathVariable("nombre1") nombre1: Double,
        @PathVariable("nombre2") nombre2: Double
    ): Double {
        return nombre1 + nombre2
    }

    @GetMapping("/subtract/{nombre1}/{nombre2}")
    fun subtract(
        @PathVariable("nombre1") nombre1: Double,
        @PathVariable("nombre2") nombre2: Double
    ): Double {
        return nombre1 - nombre2
    }

    @GetMapping("/multiply/{nombre1}/{nombre2}")
    fun multiply(
        @PathVariable("nombre1") nombre1: Double,
        @PathVariable("nombre2") nombre2: Double
    ): Double {
        return nombre1 * nombre2
    }

    @GetMapping("/divide/{nombre1}/{nombre2}")
    fun divide(
        @PathVariable("nombre1") nombre1: Double,
        @PathVariable("nombre2") nombre2: Double
    ): Double {
        if (nombre2 == 0.0) {
            throw ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Division par zero impossible"
            )
        }

        return nombre1 / nombre2
    }
}
