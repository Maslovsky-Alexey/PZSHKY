using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ElectronicSchem.Models.ElectronicSchemModels.Schems
{
    public class WireModel
    {
        [Key]
        public long ID { get; set; }

        public string X1 { get; set; }

        public string Y1 { get; set; }

        public string X2 { get; set; }

        public string Y2 { get; set; }

        public Posts.PostModel Post { get; set; }
    }

}