using ElectronicSchem.Models.ElectronicSchemModels.Components;

namespace ElectronicSchem.Models.ViewModels
{
    public class InputViewModel
    {

        public double x { get; set; }

        public double y { get; set; }

        public string color { get; set; }

        public InputViewModel(InputModel input)
        {
            x = input.X;
            y = input.Y;
            color = input.Color;
        }
    }
}